import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCar } from '../services/cars';
import useResource from '../hooks/useResource';
import usePageTitle from '../hooks/usePageTitle';
import LoadState from '../components/LoadState';
import CarImage from '../components/CarImage';

export default function CarDetailsPage() {
  const { carId } = useParams();
  const load = useCallback(signal => getCar(carId, signal), [carId]);
  const { data: car, loading, error, reload } = useResource(load, carId);
  usePageTitle(car ? `${car.make} ${car.model}` : 'Car details');

  return (
    <section className="container page">
      <Link to="/cars">Back to cars</Link>
      <LoadState loading={loading} error={error} onRetry={reload} />
      {!loading && !error && !car && <h1>Car not found</h1>}
      {car && (
        <article className="car-details">
          <h1>{car.make} {car.model}</h1>
          <CarImage src={car.image_url} alt={`${car.make} ${car.model}`} />
          <p><strong>Year:</strong> {car.year}</p>
          <p><strong>Shared by:</strong> {car.profiles?.display_name || 'Member'}</p>
          <h2>About this car</h2>
          <p className="preserve-lines">{car.description}</p>
        </article>
      )}
    </section>
  );
}
