import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="notfound-page page-enter">
      <div className="notfound-container container">
        <div className="notfound-graphic">
          <span className="notfound-code">404</span>
          <span className="notfound-emoji">🗺️</span>
        </div>
        <h1 className="notfound-title">You seem a bit lost</h1>
        <p className="notfound-text">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary btn-lg" id="notfound-home-btn">
            Back to Explore
          </Link>
          <Link to="/create" className="btn btn-outline btn-lg">
            Create a Listing
          </Link>
        </div>
      </div>
    </main>
  );
}
