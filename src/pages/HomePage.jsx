import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function HomePage() {
  usePageTitle('Home');

  return (
    <div className="container page">
      <section className="welcome">
        <h1>Welcome to GarageHub</h1>
        <p>A place for car enthusiasts to share their cars and talk about them.</p>
        <Link className="button" to="/cars">Browse cars</Link>
      </section>

      <section className="home-info" aria-labelledby="community-heading">
        <h2 id="community-heading">About the community</h2>
        <p>GarageHub brings car owners together. Here is what you can do:</p>
        <div className="card-grid">
          <article className="info-card">
            <h3>Explore cars</h3>
            <p>Browse cars shared by other members and read their stories.</p>
          </article>
          <article className="info-card">
            <h3>Share your car</h3>
            <p>Add your car and tell the community about its features and modifications.</p>
          </article>
          <article className="info-card">
            <h3>Join the discussion</h3>
            <p>Leave comments and learn from other car enthusiasts.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
