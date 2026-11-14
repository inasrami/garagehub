import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function AboutPage() {
  usePageTitle('About');

  return (
    <section className="container page">
      <div className="about-content">
        <h1>About GarageHub</h1>
        <p>GarageHub is a student project built with React. It is a community website for people who enjoy cars.</p>
        <p>The goal is to let members share their cars, manage their posts, and leave comments on other cars.</p>

        <h2>Who is it for?</h2>
        <p>Everyone interested in cars is welcome, whether they own a daily driver, a classic car, or a project car.</p>

        <h2>Community rules</h2>
        <ul>
          <li>Be respectful to other members.</li>
          <li>Share accurate information about your car.</li>
          <li>Keep comments useful and related to the post.</li>
        </ul>

        <Link className="button" to="/cars">Browse cars</Link>
      </div>
    </section>
  );
}
