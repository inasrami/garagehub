import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCars } from '../services/cars';
import useResource from '../hooks/useResource';
import usePageTitle from '../hooks/usePageTitle';
import LoadState from '../components/LoadState';
import CarCard from '../components/CarCard';

export default function MyGaragePage() {
  usePageTitle('My garage');
  const { user } = useAuth();
  const load = useCallback(signal => getCars(signal, user.id), [user.id]);
  const { data: cars, loading, error, reload } = useResource(load, user.id);
  return (
    <section className="container page">
      <h1>My garage</h1>
      <Link className="button" to="/cars/new">Add car</Link>
      <p>Cars you have shared with the community.</p>
      <LoadState loading={loading} error={error} onRetry={reload} />
      {!loading && !error && (cars.length
        ? <div className="card-grid">{cars.map(car => <CarCard key={car.id} car={car} />)}</div>
        : <p className="notice">You have not posted any cars yet.</p>)}
    </section>
  );
}
