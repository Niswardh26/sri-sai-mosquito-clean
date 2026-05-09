import React, { useState } from 'react';
import { submitInquiry } from '../api/apiClient';

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '0.2rem', display: 'block' },
  input: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  textarea: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', minHeight: '100px', resize: 'vertical' },
  btn: { padding: '0.7rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' },
  error: { color: '#c0392b', fontSize: '0.82rem' },
  success: { background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '6px', fontWeight: 600 },
};

export default function InquiryForm({ defaultProductInterest = '' }) {
  const [form, setForm] = useState({ customerName: '', phone: '', address: '', message: '', productInterest: defaultProductInterest });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number (7-15 digits)';
    if (!form.message.trim()) e.message = 'Message is required';
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
      await submitInquiry(form);
      setSuccess(true);
      setForm({ customerName: '', phone: '', address: '', message: '', productInterest: '' });
    } catch (err) {
      if (err.response?.status === 400) setServerError(err.response.data?.message || 'Validation error');
      else setServerError('Something went wrong, please retry.');
    } finally { setLoading(false); }
  };

  if (success) return <div style={styles.success}>✓ Your inquiry has been submitted! We will contact you soon.</div>;

  return (
    <form style={styles.form} onSubmit={handleSubmit} noValidate>
      {serverError && <div style={styles.error}>{serverError}</div>}
      <div>
        <label style={styles.label}>Full Name *</label>
        <input style={styles.input} value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} />
        {errors.customerName && <div style={styles.error}>{errors.customerName}</div>}
      </div>
      <div>
        <label style={styles.label}>Phone *</label>
        <input style={styles.input} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        {errors.phone && <div style={styles.error}>{errors.phone}</div>}
      </div>
      <div>
        <label style={styles.label}>Address</label>
        <input style={styles.input} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
      </div>
      <div>
        <label style={styles.label}>Product of Interest</label>
        <input style={styles.input} value={form.productInterest} onChange={e => setForm(f => ({ ...f, productInterest: e.target.value }))} />
      </div>
      <div>
        <label style={styles.label}>Message *</label>
        <textarea style={styles.textarea} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
        {errors.message && <div style={styles.error}>{errors.message}</div>}
      </div>
      <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Send Inquiry'}
      </button>
    </form>
  );
}
