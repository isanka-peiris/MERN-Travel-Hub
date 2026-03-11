import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import './EditModal.css';

export default function EditModal({ listing, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    image: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const overlayRef = useRef(null);

  // Pre-fill the form with listing values
  useEffect(() => {
    if (listing) {
      setForm({
        title: listing.title || '',
        location: listing.location || '',
        image: listing.image || '',
        shortDescription: listing.shortDescription || '',
        fullDescription: listing.fullDescription || '',
        price: listing.price ?? '',
      });
    }
  }, [listing]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.image.trim() || !form.shortDescription.trim()) {
      setError('Title, location, image URL, and short description are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        location: form.location.trim(),
        image: form.image.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        price: form.price !== '' ? Number(form.price) : null,
      };
      const { data } = await api.put(`/listings/${listing._id}`, payload);
      onSave(data.listing);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div className="edit-modal__overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Edit listing">
      <div className="edit-modal__card">
        {/* Header */}
        <div className="edit-modal__header">
          <h2 className="edit-modal__title">✏️ Edit Listing</h2>
          <button className="edit-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="edit-modal__error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="edit-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="edit-modal__row">
            <label className="edit-modal__label" htmlFor="em-title">Title *</label>
            <input
              id="em-title"
              className="edit-modal__input"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Sunset Boat Tour"
              required
            />
          </div>

          <div className="edit-modal__row">
            <label className="edit-modal__label" htmlFor="em-location">Location *</label>
            <input
              id="em-location"
              className="edit-modal__input"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Bali, Indonesia"
              required
            />
          </div>

          <div className="edit-modal__row">
            <label className="edit-modal__label" htmlFor="em-image">Image URL *</label>
            <input
              id="em-image"
              className="edit-modal__input"
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </div>

          <div className="edit-modal__row">
            <label className="edit-modal__label" htmlFor="em-short">Short Description *</label>
            <textarea
              id="em-short"
              className="edit-modal__input edit-modal__textarea"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="A brief summary shown on the card"
              rows={2}
              required
            />
          </div>

          <div className="edit-modal__row">
            <label className="edit-modal__label" htmlFor="em-full">Full Description</label>
            <textarea
              id="em-full"
              className="edit-modal__input edit-modal__textarea"
              name="fullDescription"
              value={form.fullDescription}
              onChange={handleChange}
              placeholder="Detailed description for the listing page"
              rows={3}
            />
          </div>

          <div className="edit-modal__row">
            <label className="edit-modal__label" htmlFor="em-price">Price per person ($)</label>
            <input
              id="em-price"
              className="edit-modal__input"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 49.99"
              min="0"
              step="0.01"
            />
          </div>

          {/* Actions */}
          <div className="edit-modal__actions">
            <button type="button" className="edit-modal__btn edit-modal__btn--cancel" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="edit-modal__btn edit-modal__btn--save" disabled={saving}>
              {saving ? (
                <><span className="edit-modal__spinner" /> Saving…</>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
