import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auth.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    else if (formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (!formData.confirm) errs.confirm = 'Please confirm your password';
    else if (formData.confirm !== formData.password)
      errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    setApiError('');
    try {
      const { data } = await api.post('/auth/register', {
        name:     formData.name.trim(),
        email:    formData.email.trim(),
        password: formData.password,
      });
      register(data.token, data.user);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg page-enter">
      <div className="auth-card auth-card--register">
        {/* Left Panel */}
        <div className="auth-panel auth-panel--green">
          <div className="auth-panel__inner">
            <span className="auth-panel__emoji">🌍</span>
            <h2 className="auth-panel__title">Join the<br />adventure.</h2>
            <p className="auth-panel__text">
              Create an account to publish your own travel experiences and inspire explorers worldwide.
            </p>
            <div className="auth-panel__perks">
              <div className="auth-panel__perk">✅ Free to join</div>
              <div className="auth-panel__perk">✅ Publish experiences</div>
              <div className="auth-panel__perk">✅ Connect with travelers</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-form-panel">
          <Link to="/" className="auth-back-link">← Back to Feed</Link>

          <div className="auth-form-header">
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-subtitle">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div className="auth-api-error" role="alert">
              <span>⚠️</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                name="confirm"
                className={`form-input ${errors.confirm ? 'form-input--error' : ''}`}
                placeholder="Repeat your password"
                value={formData.confirm}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={isLoading}
              id="register-submit-btn"
            >
              {isLoading ? (
                <><span className="spinner" /> Creating account...</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="auth-disclaimer">
            Connected to live backend API — your data is securely stored.
          </p>
        </div>
      </div>
    </div>
  );
}
