import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

// The next phase will fetch real car posts from the backend.
export default function ExplorePage() {
  usePageTitle('Cars');

  return (
    <section className="container page">
      <h1>Cars</h1>
      <p>Explore cars shared by the community.</p>

      <div className="notice">
        <h2>Catalog coming soon</h2>
        <p>We are setting up the community garage. Car posts will appear here when it is ready.</p>
        <Link to="/about">Read about GarageHub</Link>
      </div>
    </section>
  );
}
