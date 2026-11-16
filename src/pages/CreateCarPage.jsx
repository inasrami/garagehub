import { useNavigate } from 'react-router-dom';
import CarForm from '../components/CarForm';
import { createCar } from '../services/cars';
import usePageTitle from '../hooks/usePageTitle';

export default function CreateCarPage() {
  usePageTitle('Add car');
  const navigate = useNavigate();
  async function save(values) {
    const car = await createCar(values);
    navigate(`/cars/${car.id}`);
  }
  return <section className="container page"><div className="form-panel"><h1>Add car</h1><CarForm onSave={save} /></div></section>;
}
