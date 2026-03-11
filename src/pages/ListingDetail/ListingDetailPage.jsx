import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/timeAgo';
import api from '../../services/api';
import './ListingDetailPage.css';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchListing = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/listings/${id}`);
        if (!cancelled) setListing(data);
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) {
            navigate('/404');
          } else {
            setError(
              err.response?.data?.message ||
              'Failed to load listing. Please try again.'
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchListing();
    return () => { cancelled = true; };
  }, [id, navigate]);

  // Loading state
  if (loading) {
    return (
      <main className="detail-page page-enter">
        <div className="container">
          <div className="detail-loading">
            <span className="feed__spinner" />
            <p className="feed__loading-text">Loading experience...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="detail-page page-enter">
        <div className="container">
          <div className="feed__error">
            <span className="feed__error-icon">⚠️</span>
            <h3 className="feed__error-title">Failed to load listing</h3>
            <p className="feed__error-text">{error}</p>
            <Link to="/" className="btn btn-outline">← Back to Feed</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!listing) return null;

  return (
    <main className="detail-page page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="detail-breadcrumb__link">Explore</Link>
          <span className="detail-breadcrumb__sep">›</span>
          <span className="detail-breadcrumb__current">{listing.title}</span>
        </nav>

        <div className="detail-layout">
          {/* Left — Image & Info */}
          <div className="detail-main">
            <div className="detail-image-wrap">
              {!imgLoaded && <div className="detail-image-skeleton" />}
              <img
                className={`detail-image ${imgLoaded ? 'detail-image--loaded' : ''}`}
                src={listing.image}
                alt={listing.title}
                onLoad={() => setImgLoaded(true)}
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80';
                  setImgLoaded(true);
                }}
              />
              <div className="detail-image-overlay" />
              <div className="detail-image-meta">
                <span className="detail-location-badge">📍 {listing.location}</span>
                {listing.price && (
                  <span className="detail-price-badge">${listing.price} / person</span>
                )}
              </div>
            </div>

            <div className="detail-content">
              <h1 className="detail-title">{listing.title}</h1>

              <div className="detail-creator-row">
                <div className="detail-creator">
                  <span className="detail-creator-avatar">
                    {listing.creatorName?.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="detail-creator-label">Hosted by</p>
                    <p className="detail-creator-name">{listing.creatorName}</p>
                  </div>
                </div>
                <span className="detail-time">{timeAgo(listing.createdAt)}</span>
              </div>

              <div className="detail-divider" />

              <div className="detail-description">
                <h2 className="detail-section-title">About this Experience</h2>
                <p className="detail-description-text">
                  {listing.fullDescription || listing.shortDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Right — Booking Card */}
          <aside className="detail-sidebar">
            <div className="detail-booking-card">
              {listing.price ? (
                <div className="detail-booking-price">
                  <span className="detail-booking-amount">${listing.price}</span>
                  <span className="detail-booking-per">&nbsp;per person</span>
                </div>
              ) : (
                <div className="detail-booking-price">
                  <span className="detail-booking-amount">Free</span>
                </div>
              )}

              <div className="detail-booking-divider" />

              <div className="detail-booking-info">
                <div className="detail-booking-row">
                  <span className="detail-booking-icon">📍</span>
                  <div>
                    <p className="detail-booking-label">Location</p>
                    <p className="detail-booking-value">{listing.location}</p>
                  </div>
                </div>
                <div className="detail-booking-row">
                  <span className="detail-booking-icon">👤</span>
                  <div>
                    <p className="detail-booking-label">Host</p>
                    <p className="detail-booking-value">{listing.creatorName}</p>
                  </div>
                </div>
                <div className="detail-booking-row">
                  <span className="detail-booking-icon">🕐</span>
                  <div>
                    <p className="detail-booking-label">Posted</p>
                    <p className="detail-booking-value">{timeAgo(listing.createdAt)}</p>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary btn-lg detail-booking-btn" id="book-now-btn">
                Book This Experience
              </button>

              <div className="detail-booking-user">
                <span className="detail-booking-user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span className="detail-booking-user-name">
                  Booking as <strong>{user?.name}</strong>
                </span>
              </div>
            </div>

            <Link to="/" className="detail-back-btn">
              ← Back to all experiences
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
