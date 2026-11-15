import { useCallback, useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import useResource from '../hooks/useResource';
import { getCars } from '../services/cars';
import CarCard from '../components/CarCard';
import LoadState from '../components/LoadState';

export default function ExplorePage() {
  usePageTitle('Cars');
  const [search, setSearch] = useState('');
  const load = useCallback(signal => getCars(signal), []);
  const { data: cars, loading, error, reload } = useResource(load, 'catalog');
  const visibleCars = (cars || []).filter(car =>
    `${car.make} ${car.model}`.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <section className="container page">
      <h1>Cars</h1>
      <p>Explore cars shared by the community.</p>
      <div className="field search-field">
        <label htmlFor="search">Search by make or model</label>
        <input id="search" value={search} onChange={event => setSearch(event.target.value)} />
      </div>
      <LoadState loading={loading} error={error} onRetry={reload} />
      {!loading && !error && (
        visibleCars.length ? <div className="card-grid">{visibleCars.map(car => <CarCard key={car.id} car={car} />)}</div>
          : <p className="notice">{cars.length ? 'No cars match your search.' : 'No cars have been posted yet.'}</p>
      )}
    </section>
  );
}
