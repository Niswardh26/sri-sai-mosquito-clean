import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: '2rem 0' },
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2.5rem', width: '100%', maxWidth: '480px' },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  logoTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e' },
  logoSub: { color: '#888', fontSize: '0.9rem' },
  row: { display: 'flex', gap: '1rem' },
  half: { flex: 1 },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', marginBottom: '1.2rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.8rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  error: { background: '#fdecea', color: '#c0392b', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  fieldError: { color: '#c0392b', fontSize: '0.82rem', marginTop: '-1rem', marginBottom: '0.8rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' },
  link: { color: '#e94560', fontWeight: 600, textDecoration: 'none' },
};

export default function UserRegister() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.username.trim() || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setServerError('');
    try {
      const { confirmPassword, ...payload } = form;
      const res = await register(payload);
      loginUser(res.data);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed, please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoTitle}>Sri Sai Mosquito Enterprises</div>
          <div style={styles.logoSub}>Create Account</div>
        </div>
        {serverError && <div style={styles.error}>{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.row}>
            <div style={styles.half}>
              <label style={styles.label}>First Name *</label>
              <input style={styles.input} value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              {errors.firstName && <div style={styles.fieldError}>{errors.firstName}</div>}
            </div>
            <div style={styles.half}>
              <label style={styles.label}>Last Name *</label>
              <input style={styles.input} value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              {errors.lastName && <div style={styles.fieldError}>{errors.lastName}</div>}
            </div>
          </div>

          <label style={styles.label}>Username *</label>
          <input style={styles.input} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          {errors.username && <div style={styles.fieldError}>{errors.username}</div>}

          <label style={styles.label}>Email *</label>
          <input style={styles.input} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          {errors.email && <div style={styles.fieldError}>{errors.email}</div>}

          <label style={styles.label}>Password *</label>
          <input style={styles.input} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          {errors.password && <div style={styles.fieldError}>{errors.password}</div>}

          <label style={styles.label}>Confirm Password *</label>
          <input style={styles.input} type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
          {errors.confirmPassword && <div style={styles.fieldError}>{errors.confirmPassword}</div>}

          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
