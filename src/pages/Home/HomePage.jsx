import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/timeAgo';
import api from '../../services/api';
import ListingCard from '../../components/ListingCard/ListingCard';
import EditModal from '../../components/EditModal/EditModal';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingListing, setEditingListing] = useState(null); // listing being edited
  const [deletingId, setDeletingId]   = useState(null);       // id being deleted

  useEffect(() => {
    let cancelled = false;
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/listings');
        if (!cancelled) setListings(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            'Failed to load listings. Please check your connection and try again.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchListings();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
    );
  }, [searchQuery, listings]);

  const handleCardClick = (id) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/listing/${id}`);
    }
  };

  const handleRetry = () => {
    setError('');
    setListings([]);
    setLoading(true);
    api.get('/listings')
      .then(({ data }) => setListings(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load listings.'))
      .finally(() => setLoading(false));
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async (listing) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${listing.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(listing._id);
    try {
      await api.delete(`/listings/${listing._id}`);
      setListings((prev) => prev.filter((l) => l._id !== listing._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Edit ──────────────────────────────────────────────
  const handleEditSave = (updatedListing) => {
    setListings((prev) =>
      prev.map((l) => (l._id === updatedListing._id ? updatedListing : l))
    );
    setEditingListing(null);
  };

  return (
    <main className="home-page page-enter">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <span className="hero__pill">🌍 Discover the World</span>
          <h1 className="hero__title">
            Find Your Next<br />
            <span className="hero__title-highlight">Unforgettable</span> Experience
          </h1>
          <p className="hero__subtitle">
            Handpicked travel experiences from local experts around the globe.
            Authentic adventures, real connections.
          </p>

          {/* Search Bar */}
          <div className="hero__search">
            <span className="hero__search-icon">🔍</span>
            <input
              id="search-input"
              type="text"
              className="hero__search-input"
              placeholder="Search by destination or experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search listings"
            />
            {searchQuery && (
              <button
                className="hero__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">{listings.length}+</span>
              <span className="hero__stat-label">Experiences</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">6</span>
              <span className="hero__stat-label">Countries</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">100%</span>
              <span className="hero__stat-label">Authentic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section className="feed container">
        <div className="feed__header">
          <div>
            <h2 className="feed__title">
              {searchQuery ? `Results for "${searchQuery}"` : 'Latest Experiences'}
            </h2>
            {!loading && !error && (
              <p className="feed__count">
                {filtered.length} {filtered.length === 1 ? 'experience' : 'experiences'} found
              </p>
            )}
          </div>

          {!user && (
            <div className="feed__guest-notice">
              <span>🔒</span>
              <span>
                <button
                  className="feed__guest-link"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </button>
                &nbsp;to view full details
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="feed__loading">
            <span className="feed__spinner" />
            <p className="feed__loading-text">Loading experiences...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="feed__error">
            <span className="feed__error-icon">⚠️</span>
            <h3 className="feed__error-title">Something went wrong</h3>
            <p className="feed__error-text">{error}</p>
            <button className="btn btn-outline" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="feed__grid">
            {filtered.map((listing) => {
              const isOwner = user && (
                listing.creator === user._id ||
                listing.creator?._id === user._id ||
                listing.creator?.toString() === user._id?.toString()
              );

              return (
                <div key={listing._id} className={`feed__card-wrap${deletingId === listing._id ? ' feed__card-wrap--deleting' : ''}`}>
                  <ListingCard
                    listing={{ ...listing, id: listing._id }}
                    timeAgo={timeAgo(listing.createdAt)}
                    onClick={() => handleCardClick(listing._id)}
                    isGuest={!user}
                    onEdit={isOwner ? () => setEditingListing(listing) : undefined}
                    onDelete={isOwner ? () => handleDelete(listing) : undefined}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="feed__empty">
            <span className="feed__empty-icon">🗺️</span>
            <h3 className="feed__empty-title">
              {searchQuery ? 'No experiences found' : 'No listings yet'}
            </h3>
            <p className="feed__empty-text">
              {searchQuery ? (
                <>
                  Try different search terms or{' '}
                  <button className="feed__guest-link" onClick={() => setSearchQuery('')}>
                    clear the search
                  </button>
                </>
              ) : (
                'Be the first to share your travel experience!'
              )}
            </p>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {editingListing && (
        <EditModal
          listing={editingListing}
          onSave={handleEditSave}
          onClose={() => setEditingListing(null)}
        />
      )}
    </main>
  );
}

