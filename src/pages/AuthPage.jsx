import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import { validateAuth } from '../utils/validation';
import { errorMessage } from '../utils/errors';

export default function AuthPage({ registering = false }) {
  const title = registering ? 'Create account' : 'Log in';
  usePageTitle(title);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '', confirmPassword: '', displayName: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function change(event) {
    setValues(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const nextErrors = validateAuth(values, registering);
    setErrors(nextErrors);
    setError('');
    setMessage('');
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      if (registering) {
        const data = await register(values.email.trim(), values.password, values.displayName.trim());
        if (!data.session) {
          setMessage('Check your email to confirm your account, then log in. If you already have an account, use Log in.');
          setValues(current => ({ ...current, password: '', confirmPassword: '' }));
          return;
        }
      } else {
        await login(values.email.trim(), values.password);
      }
      const from = location.state?.from;
      navigate(typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/my-garage', { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  const fields = [
    ...(registering ? [{ name: 'displayName', label: 'Display name', type: 'text', autoComplete: 'nickname', maxLength: 30 }] : []),
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', maxLength: 254 },
    { name: 'password', label: 'Password', type: 'password', autoComplete: registering ? 'new-password' : 'current-password' },
    ...(registering ? [{ name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password' }] : []),
  ];

  return (
    <section className="container page">
      <div className="form-panel">
        <h1>{title}</h1>
        {registering && <p>Use a password with at least 8 characters.</p>}
        {error && <p className="error-box" role="alert">{error}</p>}
        {message && <p className="success-box" role="status">{message}</p>}
        <form onSubmit={submit} noValidate>
          {fields.map(field => (
            <div className="field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input id={field.name} name={field.name} type={field.type} autoComplete={field.autoComplete}
                maxLength={field.maxLength} value={values[field.name]} onChange={change} disabled={busy}
                aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} required />
              {errors[field.name] && <p className="field-error" id={`${field.name}-error`} role="alert">{errors[field.name]}</p>}
            </div>
          ))}
          <button className="button" disabled={busy}>{busy ? 'Please wait...' : title}</button>
        </form>
        <p>{registering ? <>Already registered? <Link to="/login">Log in</Link></> : <>New member? <Link to="/register">Create an account</Link></>}</p>
      </div>
    </section>
  );
}
