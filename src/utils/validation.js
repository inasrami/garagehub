export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || '');
}

export function isImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validateAuth(values, registering = false) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Enter your password.';
  if (registering) {
    if (values.password.length < 8) errors.password = 'Use at least 8 characters.';
    if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (values.displayName.trim().length < 2 || values.displayName.trim().length > 30) {
      errors.displayName = 'Use 2–30 characters for your display name.';
    }
  }
  return errors;
}
