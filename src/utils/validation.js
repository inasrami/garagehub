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

export function validateCar(values, currentYear = new Date().getFullYear()) {
  const errors = {};
  if (values.make.trim().length < 2 || values.make.trim().length > 40) errors.make = 'Make must be 2–40 characters.';
  if (!values.model.trim() || values.model.trim().length > 60) errors.model = 'Model must be 1–60 characters.';
  if (!/^\d{4}$/.test(String(values.year)) || Number(values.year) < 1886 || Number(values.year) > currentYear + 1) {
    errors.year = `Enter a year between 1886 and ${currentYear + 1}.`;
  }
  if (!isImageUrl(values.image_url.trim()) || values.image_url.trim().length > 2000) errors.image_url = 'Enter a public HTTPS image URL of at most 2000 characters.';
  if (values.description.trim().length < 20 || values.description.trim().length > 3000) errors.description = 'Description must be 20–3000 characters.';
  return errors;
}

export function carPayload(values) {
  // Only writable fields are sent. Identity and timestamps come from the database.
  return {
    make: values.make.trim(), model: values.model.trim(), year: Number(values.year),
    image_url: values.image_url.trim(), description: values.description.trim(),
  };
}
