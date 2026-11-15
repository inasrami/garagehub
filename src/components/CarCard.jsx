import { Link } from 'react-router-dom';
import CarImage from './CarImage';

export default function CarCard({ car }) {
  return (
    <article className="car-card">
      <CarImage src={car.image_url} alt={`${car.make} ${car.model}`} />
      <div className="car-card-body">
        <h2>{car.make} {car.model}</h2>
        <p>{car.year} · {car.profiles?.display_name || 'Member'}</p>
        <Link className="button" to={`/cars/${car.id}`}>View details</Link>
      </div>
    </article>
  );
}
