import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' },
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2.5rem', width: '100%', maxWidth: '420px' },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  logoTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e' },
  logoSub: { color: '#888', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', marginBottom: '1.2rem' },
  btn: { width: '100%', padding: '0.8rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  error: { background: '#fdecea', color: '#c0392b', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
};

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.username.trim() || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
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
      const res = await login(form);
      loginUser(res.data);
      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401)
        setServerError('Invalid credentials or insufficient permissions.');
      else setServerError('Something went wrong, please retry.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoTitle}>Sri Sai Mosquito Enterprises</div>
          <div style={styles.logoSub}>Admin Portal</div>
        </div>
        {serverError && <div style={styles.error}>{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <label style={styles.label}>Username</label>
          <input style={styles.input} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          {errors.username && <div style={{ color: '#c0392b', fontSize: '0.82rem', marginTop: '-1rem', marginBottom: '0.8rem' }}>{errors.username}</div>}

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          {errors.password && <div style={{ color: '#c0392b', fontSize: '0.82rem', marginTop: '-1rem', marginBottom: '0.8rem' }}>{errors.password}</div>}

          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
