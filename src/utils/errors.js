export function errorMessage(error) {
  const message = error?.message || String(error || '');
  if (/fetch|network|abort|timeout/i.test(message)) {
    return 'Could not reach the server. Check your connection and try again.';
  }
  if (error?.code === '42501') return 'You do not have permission to perform this action.';
  if (error?.code === '23503') return 'This record no longer exists. Refresh the page.';
  if (error?.code === '23514') return 'Some values are invalid. Check the form and try again.';
  return message || 'Something went wrong. Please try again.';
}
