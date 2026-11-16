import { useNavigate, useOutletContext } from 'react-router-dom';
import CarForm from '../components/CarForm';
import { updateCar } from '../services/cars';
import usePageTitle from '../hooks/usePageTitle';

export default function EditCarPage() {
  usePageTitle('Edit car');
  const car = useOutletContext();
  const navigate = useNavigate();
  async function save(values) {
    await updateCar(car.id, values);
    navigate(`/cars/${car.id}`);
  }
  return <section className="container page"><div className="form-panel"><h1>Edit car</h1><CarForm key={car.id} car={car} onSave={save} /></div></section>;
}
