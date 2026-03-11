import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './CreateListingPage.css';

export default function CreateListingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
  });
  const [errors, setErrors]         = useState({});
  const [apiError, setApiError]     = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError]     = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    else if (formData.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.image.trim()) errs.image = 'Image URL is required';
    else {
      try { new URL(formData.image); } catch { errs.image = 'Enter a valid URL'; }
    }
    if (!formData.shortDescription.trim()) errs.shortDescription = 'Short description is required';
    else if (formData.shortDescription.trim().length < 20)
      errs.shortDescription = 'Must be at least 20 characters';
    if (formData.price && isNaN(Number(formData.price)))
      errs.price = 'Price must be a number';
    else if (formData.price && Number(formData.price) < 0)
      errs.price = 'Price cannot be negative';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');

    if (name === 'image') {
      setImagePreview(value);
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    setApiError('');
    try {
      await api.post('/listings', {
        title:            formData.title.trim(),
        location:         formData.location.trim(),
        image:            formData.image.trim(),
        shortDescription: formData.shortDescription.trim(),
        fullDescription:  formData.fullDescription.trim(),
        price:            formData.price ? Number(formData.price) : null,
      });
      navigate('/', { state: { success: true, title: formData.title.trim() } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create listing. Please try again.';
      setApiError(msg);
      setIsLoading(false);
    }
  };

  return (
    <main className="create-page page-enter">
      <div className="container">
        <div className="create-layout">
          {/* Form Panel */}
          <div className="create-form-wrap">
            <div className="create-header">
              <Link to="/" className="create-back-link">← Back to Feed</Link>
              <h1 className="create-title">Create an Experience</h1>
              <p className="create-subtitle">
                Share your unique travel experience with the WanderHub community.
              </p>
            </div>

            {/* API Error Banner */}
            {apiError && (
              <div className="auth-api-error" role="alert">
                <span>⚠️</span> {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="create-form" noValidate>
              <div className="create-form-section">
                <h2 className="create-section-title">Basic Information</h2>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-title">
                    Experience Title <span className="create-required">*</span>
                  </label>
                  <input
                    id="exp-title"
                    type="text"
                    name="title"
                    className={`form-input ${errors.title ? 'form-input--error' : ''}`}
                    placeholder="e.g. Sunset Boat Tour in Bali"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={100}
                    autoFocus
                  />
                  {errors.title ? (
                    <span className="form-error">{errors.title}</span>
                  ) : (
                    <span className="create-hint">Make it compelling and specific</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-location">
                    Location <span className="create-required">*</span>
                  </label>
                  <input
                    id="exp-location"
                    type="text"
                    name="location"
                    className={`form-input ${errors.location ? 'form-input--error' : ''}`}
                    placeholder="e.g. Bali, Indonesia"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-price">
                    Price (USD) <span className="create-optional">Optional</span>
                  </label>
                  <div className="create-price-wrap">
                    <span className="create-price-prefix">$</span>
                    <input
                      id="exp-price"
                      type="number"
                      name="price"
                      className={`form-input create-price-input ${errors.price ? 'form-input--error' : ''}`}
                      placeholder="45"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.price ? (
                    <span className="form-error">{errors.price}</span>
                  ) : (
                    <span className="create-hint">Leave blank if free</span>
                  )}
                </div>
              </div>

              <div className="create-form-section">
                <h2 className="create-section-title">Image</h2>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-image">
                    Image URL <span className="create-required">*</span>
                  </label>
                  <input
                    id="exp-image"
                    type="url"
                    name="image"
                    className={`form-input ${errors.image ? 'form-input--error' : ''}`}
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={handleChange}
                  />
                  {errors.image ? (
                    <span className="form-error">{errors.image}</span>
                  ) : (
                    <span className="create-hint">Paste a direct link to a high-quality photo</span>
                  )}
                </div>

                {imagePreview && !imageError && (
                  <div className="create-image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      onError={() => setImageError(true)}
                    />
                    <span className="create-preview-label">Preview</span>
                  </div>
                )}
                {imagePreview && imageError && (
                  <p className="create-image-error">⚠️ Could not load image from that URL</p>
                )}
              </div>

              <div className="create-form-section">
                <h2 className="create-section-title">Description</h2>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-short">
                    Short Description <span className="create-required">*</span>
                  </label>
                  <textarea
                    id="exp-short"
                    name="shortDescription"
                    className={`form-textarea ${errors.shortDescription ? 'form-input--error' : ''}`}
                    placeholder="A brief, enticing summary of your experience (shown on listing cards)..."
                    value={formData.shortDescription}
                    onChange={handleChange}
                    maxLength={250}
                    rows={3}
                  />
                  <div className="create-textarea-footer">
                    {errors.shortDescription ? (
                      <span className="form-error">{errors.shortDescription}</span>
                    ) : (
                      <span className="create-hint">Displayed on search cards</span>
                    )}
                    <span className="create-char-count">
                      {formData.shortDescription.length}/250
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-full">
                    Full Description <span className="create-optional">Optional</span>
                  </label>
                  <textarea
                    id="exp-full"
                    name="fullDescription"
                    className="form-textarea"
                    placeholder="Describe your experience in detail — what's included, what to expect, meeting point, group size, etc..."
                    value={formData.fullDescription}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>
              </div>

              {/* Host Info */}
              <div className="create-host-row">
                <div className="create-host-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="create-host-label">Listing as</p>
                  <p className="create-host-name">{user?.name}</p>
                </div>
              </div>

              <div className="create-actions">
                <Link to="/" className="btn btn-outline create-cancel-btn">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg create-submit-btn"
                  disabled={isLoading}
                  id="create-listing-btn"
                >
                  {isLoading ? (
                    <><span className="spinner create-spinner" /> Publishing...</>
                  ) : (
                    '🚀 Publish Experience'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right — Tips panel */}
          <aside className="create-tips">
            <div className="create-tips-card">
              <h3 className="create-tips-title">💡 Tips for a great listing</h3>
              <ul className="create-tips-list">
                <li>Use a high-quality, vibrant image that captures the experience.</li>
                <li>Be specific about what's included — meals, transport, equipment?</li>
                <li>Mention the group size and duration upfront.</li>
                <li>Set a fair price based on local market rates.</li>
                <li>Use action words like "explore", "discover", "experience".</li>
              </ul>
            </div>

            <div className="create-sample-card">
              <h4 className="create-sample-title">Example Listing</h4>
              <div className="create-sample-item">
                <span className="create-sample-label">Title</span>
                <span className="create-sample-value">Sunrise Hike to Mount Batur</span>
              </div>
              <div className="create-sample-item">
                <span className="create-sample-label">Location</span>
                <span className="create-sample-value">Bali, Indonesia</span>
              </div>
              <div className="create-sample-item">
                <span className="create-sample-label">Price</span>
                <span className="create-sample-value">$60 / person</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
