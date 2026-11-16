import { useAuth } from '../contexts/AuthContext';
import { errorMessage } from '../utils/errors';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Layout() {
  const { pathname } = useLocation();
  const { user, loading, error, logout } = useAuth();
  const [logoutError, setLogoutError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    setLogoutError('');
    try { await logout(); }
    catch (requestError) { setLogoutError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <div className="container header-content">
          <Link className="site-name" to="/">GarageHub</Link>
          <nav aria-label="Main navigation">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/cars">Cars</NavLink>
            <NavLink to="/about">About</NavLink>
            {!loading && (user ? <>
              <NavLink to="/my-garage">My garage</NavLink>
              <button className="nav-button" onClick={handleLogout} disabled={busy}>{busy ? 'Logging out...' : 'Log out'}</button>
            </> : <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>)}
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {(error || logoutError) && <div className="container error-box" role="alert">
          <p>{logoutError || error}</p>
          {error && <button className="button" onClick={() => window.location.reload()}>Retry session</button>}
        </div>}
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>GarageHub — React course project</p>
      </footer>
    </div>
  );
}
