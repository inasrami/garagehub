import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { deleteCar } from '../services/cars';
import { errorMessage } from '../utils/errors';

export default function CarActions({ car }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (user?.id !== car.owner_id) return null;

  async function remove() {
    if (busy || !window.confirm('Delete this car and all its comments? This cannot be undone.')) return;
    setBusy(true);
    setError('');
    try { await deleteCar(car.id); navigate('/my-garage'); }
    catch (requestError) { setError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  return <div>
    {error && <p className="error-box" role="alert">{error}</p>}
    <div className="actions">
      {!busy && <Link className="button" to={`/cars/${car.id}/edit`}>Edit car</Link>}
      <button className="button danger-button" onClick={remove} disabled={busy}>{busy ? 'Deleting...' : 'Delete car'}</button>
    </div>
  </div>;
}
