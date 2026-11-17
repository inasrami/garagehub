import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAuth, validateCar, validateComment, carPayload, isImageUrl, isUuid } from '../src/utils/validation.js';

const validCar = { make: 'BMW', model: '330d', year: '2007', image_url: 'https://example.com/car.jpg', description: 'A carefully maintained daily driver with a full service history.' };
const validAuth = { email: 'member@example.com', password: 'test-only-password', confirmPassword: 'test-only-password', displayName: 'Member' };

test('valid registration passes', () => assert.deepEqual(validateAuth(validAuth, true), {}));
test('registration rejects malformed email and short password', () => {
  const errors = validateAuth({ ...validAuth, email: 'wrong', password: '123' }, true);
  assert.ok(errors.email); assert.ok(errors.password); assert.ok(errors.confirmPassword);
});
test('display names cannot be whitespace', () => assert.ok(validateAuth({ ...validAuth, displayName: '   ' }, true).displayName));
test('login does not require registration-only fields', () => assert.deepEqual(validateAuth({ email: 'a@b.com', password: 'secret' }), {}));
test('valid car passes', () => assert.deepEqual(validateCar(validCar, 2026), {}));
test('year boundaries and malformed year are rejected', () => {
  for (const year of ['1885', '2028', '2007.5', '2e3', '', 'NaN']) assert.ok(validateCar({ ...validCar, year }, 2026).year);
  for (const year of ['1886', '2027']) assert.equal(validateCar({ ...validCar, year }, 2026).year, undefined);
});
test('description length uses trimmed text', () => {
  assert.ok(validateCar({ ...validCar, description: ' '.repeat(25) }).description);
  assert.ok(validateCar({ ...validCar, description: 'x'.repeat(3001) }).description);
});
test('image URLs reject insecure protocols and embedded credentials', () => {
  for (const url of ['javascript:alert(1)', 'data:image/png;base64,x', 'http://example.com/a.jpg', 'https://user:pass@example.com/a.jpg', 'not a url']) assert.equal(isImageUrl(url), false);
  assert.equal(isImageUrl('https://example.com/a.jpg'), true);
});
test('car payload strips attacker-controlled identity fields', () => {
  const payload = carPayload({ ...validCar, make: ' BMW ', owner_id: 'other-user', id: 'chosen-id', created_at: '2000-01-01' });
  assert.equal(payload.make, 'BMW'); assert.equal(payload.year, 2007);
  assert.equal('owner_id' in payload, false); assert.equal('id' in payload, false); assert.equal('created_at' in payload, false);
});
test('comment boundaries reject whitespace and oversize input', () => {
  assert.ok(validateComment('   ')); assert.ok(validateComment('a'.repeat(1001)));
  assert.equal(validateComment('a'.repeat(1000)), ''); assert.equal(validateComment(' hello '), '');
});
test('UUID validation handles malformed and valid route values', () => {
  assert.equal(isUuid('not-a-uuid'), false);
  assert.equal(isUuid('123e4567-e89b-12d3-a456-426614174000'), true);
});
