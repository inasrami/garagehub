import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateCar, carPayload } from '../utils/validation';
import { errorMessage } from '../utils/errors';

export default function CarForm({ car, onSave }) {
  const [values, setValues] = useState({
    make: car?.make || '', model: car?.model || '', year: String(car?.year || ''),
    image_url: car?.image_url || '', description: car?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function change(event) {
    setValues(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const nextErrors = validateCar(values);
    setErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try { await onSave(carPayload(values)); }
    catch (requestError) { setError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  const fields = [
    { name: 'make', label: 'Make', type: 'text', maxLength: 40 },
    { name: 'model', label: 'Model', type: 'text', maxLength: 60 },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'image_url', label: 'Image URL (HTTPS)', type: 'url', maxLength: 2000 },
  ];

  return (
    <form onSubmit={submit} noValidate>
      {error && <p className="error-box" role="alert">{error}</p>}
      {fields.map(field => <div className="field" key={field.name}>
        <label htmlFor={field.name}>{field.label}</label>
        <input id={field.name} name={field.name} type={field.type} value={values[field.name]}
          maxLength={field.maxLength} onChange={change} disabled={busy} required
          aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />
        {errors[field.name] && <p className="field-error" id={`${field.name}-error`} role="alert">{errors[field.name]}</p>}
      </div>)}
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={values.description} onChange={change}
          maxLength={3000} disabled={busy} required aria-invalid={Boolean(errors.description)} aria-describedby="description-help description-error" />
        <p id="description-help" className="field-help">Tell us about your car in 20–3000 characters.</p>
        <p id="description-error" className="field-error" role={errors.description ? 'alert' : undefined}>{errors.description}</p>
      </div>
      <div className="actions">
        <button className="button" disabled={busy}>{busy ? 'Saving...' : car ? 'Save changes' : 'Add car'}</button>
        {!busy && <Link to={car ? `/cars/${car.id}` : '/my-garage'}>Cancel</Link>}
      </div>
    </form>
  );
}
