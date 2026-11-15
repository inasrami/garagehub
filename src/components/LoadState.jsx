export default function LoadState({ loading, error, onRetry }) {
  if (loading) return <p role="status">Loading...</p>;
  if (error) {
    return (
      <div className="error-box" role="alert">
        <p>{error}</p>
        {onRetry && <button className="button" type="button" onClick={onRetry}>Try again</button>}
      </div>
    );
  }
  return null;
}
