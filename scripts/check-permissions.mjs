// Run only against your own configured test project/accounts.
// Creates and removes its own disposable fixtures; never changes existing posts.
import assert from 'node:assert/strict';

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_PUBLISHABLE_KEY: key,
  TEST_A_EMAIL, TEST_A_PASSWORD, TEST_B_EMAIL, TEST_B_PASSWORD } = process.env;
for (const value of [url, key, TEST_A_EMAIL, TEST_A_PASSWORD, TEST_B_EMAIL, TEST_B_PASSWORD]) {
  assert.ok(value && !value.includes('replace-') && !value.includes('YOUR_'), 'Set .env and .env.test before running.');
}
assert.notEqual(TEST_A_EMAIL, TEST_B_EMAIL, 'Use two different accounts.');

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=representation' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${url.replace(/\/$/, '')}${path}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  return { ok: response.ok, status: response.status, data };
}

async function signIn(email, password) {
  const result = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } });
  assert.ok(result.ok && result.data.access_token, 'Test-account login failed. Check email, password and confirmation.');
  return { token: result.data.access_token, id: result.data.user.id };
}

function assertDenied(result, message) {
  const forbidden = [401, 403].includes(result.status);
  const filteredOut = result.ok && Array.isArray(result.data) && result.data.length === 0;
  assert.ok(forbidden || filteredOut, message);
}

const a = await signIn(TEST_A_EMAIL, TEST_A_PASSWORD);
const b = await signIn(TEST_B_EMAIL, TEST_B_PASSWORD);
assert.notEqual(a.id, b.id);
let carId;
try {
  const fixture = { make: 'Test', model: `Permissions ${Date.now()}`, year: 2007,
    image_url: 'https://example.com/test-car.jpg', description: 'Disposable policy test car created by the verification script.' };
  let result = await request('/rest/v1/cars', { method: 'POST', token: a.token, body: fixture });
  assert.ok(result.ok && result.data?.[0]?.id, 'Account A must be able to create a car. Run migration 002.');
  carId = result.data[0].id;
  assert.equal(result.data[0].owner_id, a.id, 'Database assigns actual owner.');
  const carPath = `/rest/v1/cars?id=eq.${carId}`;
  result = await request(carPath);
  assert.equal(result.data?.[0]?.id, carId, 'Guest can read the car.');

  result = await request(carPath, { method: 'PATCH', token: b.token, body: { make: 'Stolen' } });
  assertDenied(result, 'B must not edit A car.');
  result = await request(carPath, { method: 'DELETE', token: b.token });
  assertDenied(result, 'B must not delete A car.');
  result = await request('/rest/v1/cars', { method: 'POST', token: b.token, body: { ...fixture, owner_id: a.id } });
  assertDenied(result, 'B must not impersonate A in an insert.');
  result = await request(carPath, { method: 'PATCH', token: a.token, body: { owner_id: b.id } });
  assertDenied(result, 'Ownership cannot be reassigned.');
  result = await request('/rest/v1/cars', { method: 'POST', body: fixture });
  assertDenied(result, 'Guests cannot create cars.');
  result = await request(carPath, { method: 'PATCH', body: { make: 'Guest edit' } });
  assertDenied(result, 'Guests cannot edit cars.');
  result = await request(carPath, { method: 'DELETE' });
  assertDenied(result, 'Guests cannot delete cars.');
  result = await request(carPath);
  assert.equal(result.data?.[0]?.make, fixture.make, 'Denied requests must leave record intact.');
  result = await request(carPath, { method: 'PATCH', token: a.token, body: { description: 'Updated description by the real owner of this test car.' } });
  assert.ok(result.ok && result.data?.length === 1, 'A can edit their own car.');
  result = await request(carPath, { method: 'PATCH', token: a.token, body: { year: 1000 } });
  assert.equal(result.data?.code, '23514', 'Database also validates input.');

  result = await request('/rest/v1/comments', { method: 'POST', token: b.token, body: { car_id: carId, body: 'Policy test comment' } });
  assert.ok(result.ok && result.data?.[0]?.id, 'B can comment on A car. Run migration 003.');
  const commentId = result.data[0].id;
  const commentPath = `/rest/v1/comments?id=eq.${commentId}`;
  result = await request(commentPath, { method: 'DELETE', token: a.token });
  assertDenied(result, 'Car owner cannot delete another author comment.');
  result = await request(commentPath);
  assert.equal(result.data?.[0]?.id, commentId);
  result = await request('/rest/v1/comments', { method: 'POST', body: { car_id: carId, body: 'Guest comment' } });
  assertDenied(result, 'Guest cannot comment.');
  result = await request('/rest/v1/comments', { method: 'POST', token: b.token, body: { car_id: carId, body: '   ' } });
  assert.equal(result.data?.code, '23514', 'Database rejects blank comments.');
  result = await request(commentPath, { method: 'DELETE', token: b.token });
  assert.ok(result.ok && result.data?.length === 1, 'B deletes own comment.');
  result = await request('/rest/v1/comments', { method: 'POST', token: b.token, body: { car_id: carId, body: 'Cascade test' } });
  assert.ok(result.ok, 'Create cascade fixture.');
  result = await request(carPath, { method: 'DELETE', token: a.token });
  assert.ok(result.ok && result.data?.length === 1, 'A deletes own car.');
  result = await request(`/rest/v1/comments?car_id=eq.${carId}`);
  assert.deepEqual(result.data, [], 'Deleting a car removes its comments.');
  carId = null;
  console.log('PASS: guest reads, author CRUD, second-user isolation, immutable ownership, database validation, comment permissions and cascading deletion.');
} finally {
  if (carId) {
    const result = await request(`/rest/v1/cars?id=eq.${carId}`, { method: 'DELETE', token: a.token });
    if (!result.ok) console.error('Fixture cleanup failed. Remove the test car through account A.');
  }
}
