import './ListingCard.css';

export default function ListingCard({ listing, timeAgo, onClick, isGuest, onEdit, onDelete }) {
  const isOwner = Boolean(onEdit && onDelete);

  return (
    <article className="listing-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${listing.title}`}
    >
      {/* Image */}
      <div className="listing-card__image-wrap">
        <img
          className="listing-card__image"
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80';
          }}
        />
        {listing.price && (
          <span className="listing-card__price">
            ${listing.price}
          </span>
        )}
        {isGuest && (
          <div className="listing-card__guest-overlay">
            <span className="listing-card__lock-icon">🔒</span>
            <span className="listing-card__lock-text">Sign in to view</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="listing-card__body">
        <div className="listing-card__location">
          <span className="listing-card__location-pin">📍</span>
          <span>{listing.location}</span>
        </div>

        <h3 className="listing-card__title">{listing.title}</h3>

        <p className="listing-card__desc">{listing.shortDescription}</p>

        {/* Owner Edit / Delete buttons — always visible for the owner */}
        {isOwner && (
          <div className="listing-card__owner-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="listing-card__btn listing-card__btn--edit"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
            >
              ✏️ Edit
            </button>
            <button
              className="listing-card__btn listing-card__btn--delete"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
              🗑️ Delete
            </button>
          </div>
        )}

        <div className="listing-card__footer">
          <div className="listing-card__creator">
            <span className="listing-card__creator-avatar">
              {listing.creatorName.charAt(0)}
            </span>
            <span className="listing-card__creator-name">{listing.creatorName}</span>
          </div>
          <span className="listing-card__time">{timeAgo}</span>
        </div>
      </div>
    </article>
  );
}
