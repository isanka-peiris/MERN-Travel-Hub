import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData]   = useState({ email: '', password: '' });
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
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
      const { data } = await api.post('/auth/login', {
        email:    formData.email.trim(),
        password: formData.password,
      });
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg page-enter">
      <div className="auth-card">
        {/* Left Panel — decorative */}
        <div className="auth-panel">
          <div className="auth-panel__inner">
            <span className="auth-panel__emoji">✈️</span>
            <h2 className="auth-panel__title">Welcome back,<br />explorer.</h2>
            <p className="auth-panel__text">
              Sign in to discover unique travel experiences and connect with local guides worldwide.
            </p>
            <div className="auth-panel__dots">
              <span className="auth-panel__dot auth-panel__dot--active" />
              <span className="auth-panel__dot" />
              <span className="auth-panel__dot" />
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="auth-form-panel">
          <Link to="/" className="auth-back-link">← Back to Feed</Link>

          <div className="auth-form-header">
            <h1 className="auth-form-title">Sign In</h1>
            <p className="auth-form-subtitle">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Create one free</Link>
            </p>
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div className="auth-api-error" role="alert">
              <span></span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={isLoading}
              id="login-submit-btn"
            >
              {isLoading ? (
                <><span className="spinner" /> Signing in...</>
              ) : (
                'Sign In'
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
