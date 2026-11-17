import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useResource from '../hooks/useResource';
import { getComments, createComment, deleteComment } from '../services/comments';
import { validateComment } from '../utils/validation';
import { errorMessage } from '../utils/errors';
import LoadState from './LoadState';

export default function Comments({ carId }) {
  const { user, loading: authLoading } = useAuth();
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(signal => getComments(carId, signal), [carId]);
  const { data: comments, loading, error: loadError, reload } = useResource(load, carId);

  async function submit(event) {
    event.preventDefault();
    if (busy || !user) return;
    const validationError = validateComment(body);
    setError(validationError);
    setMessage('');
    if (validationError) return;
    setBusy(true);
    try {
      await createComment(carId, body);
      setBody('');
      setMessage('Comment added.');
      reload();
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    if (busy || !window.confirm('Delete your comment?')) return;
    setBusy(true);
    setError('');
    setMessage('');
    try { await deleteComment(id); setMessage('Comment deleted.'); reload(); }
    catch (requestError) { setError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  return (
    <section className="comments" aria-labelledby="comments-heading">
      <h2 id="comments-heading">Comments</h2>
      <LoadState loading={loading} error={loadError} onRetry={reload} />
      {!loading && !loadError && (!comments.length ? <p>No comments yet.</p> : (
        <ul className="comment-list">
          {comments.map(comment => <li className="comment" key={comment.id}>
            <div className="comment-meta">
              <strong>{comment.profiles?.display_name || 'Member'}</strong>
              <time dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleDateString()}</time>
            </div>
            <p className="preserve-lines">{comment.body}</p>
            {user?.id === comment.author_id && <button className="text-button" onClick={() => remove(comment.id)} disabled={busy}>Delete comment</button>}
          </li>)}
        </ul>
      ))}
      {error && <p id="comment-error" className="error-box" role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      {authLoading ? <p role="status">Checking login...</p> : user ? (
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="comment-body">Your comment</label>
            <textarea id="comment-body" value={body} maxLength={1000} onChange={event => setBody(event.target.value)}
              disabled={busy} required aria-describedby={error ? 'comment-error' : undefined} />
          </div>
          <button className="button" disabled={busy}>{busy ? 'Please wait...' : 'Post comment'}</button>
        </form>
      ) : <p><Link to="/login" state={{ from: `/cars/${carId}` }}>Log in</Link> to leave a comment.</p>}
    </section>
  );
}
