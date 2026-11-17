import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page not found');

  return (
    <section className="container page">
      <h1>404 | Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="button" to="/">Back to home</Link>
    </section>
  );
}
