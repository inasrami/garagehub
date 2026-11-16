import { useCallback } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCar } from '../services/cars';
import useResource from '../hooks/useResource';
import LoadState from './LoadState';

export default function OwnerRoute() {
  const { user } = useAuth();
  const { carId } = useParams();
  const load = useCallback(signal => getCar(carId, signal), [carId]);
  const { data: car, loading, error, reload } = useResource(load, `${user.id}:${carId}`);
  if (loading || error) return <div className="container page"><LoadState loading={loading} error={error} onRetry={reload} /></div>;
  if (!car) return <div className="container page"><h1>Car not found</h1><Link to="/cars">Back to cars</Link></div>;
  if (car.owner_id !== user.id) return <div className="container page"><h1>Access denied</h1><p>You can only edit your own cars.</p><Link to={`/cars/${car.id}`}>View car</Link></div>;
  return <Outlet context={car} />;
}
