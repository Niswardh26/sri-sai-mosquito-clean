import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, removeCartItem, updateCartItem, clearCart, submitCart } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const styles = {
  page: { maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' },
  heading: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' },
  empty: { textAlign: 'center', padding: '4rem', color: '#888', fontSize: '1.1rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '2rem' },
  th: { background: '#1a1a2e', color: '#fff', padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.9rem' },
  td: { padding: '0.9rem 1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#333' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  qtyBtn: { width: '28px', height: '28px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' },
  qtyVal: { minWidth: '28px', textAlign: 'center', fontWeight: 600 },
  removeBtn: { padding: '0.3rem 0.8rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  clearBtn: { padding: '0.5rem 1.2rem', background: '#888', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '1.5rem' },
  submitCard: { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.8rem' },
  submitTitle: { fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.2rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#333', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' },
  submitBtn: { padding: '0.75rem 2.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' },
  error: { color: '#c0392b', fontSize: '0.82rem', marginTop: '-0.8rem', marginBottom: '0.8rem' },
  serverError: { background: '#fdecea', color: '#c0392b', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  success: { background: '#d4edda', color: '#155724', padding: '1.2rem', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', marginBottom: '1.5rem' },
  loginPrompt: { textAlign: 'center', padding: '4rem', fontSize: '1.1rem', color: '#555' },
  loginLink: { color: '#e94560', fontWeight: 700, textDecoration: 'none' },
  totalRow: { textAlign: 'right', padding: '0.8rem 1rem', fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', background: '#f9f9f9', borderTop: '2px solid #eee' },
};

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitForm, setSubmitForm] = useState({ customerName: '', phone: '', address: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadCart = () => {
    if (!user) return;
    setLoading(true);
    getCart().then(res => setCart(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadCart(); }, [user]);

  if (!user) {
    return (
      <div style={styles.loginPrompt}>
        Please <Link to="/login" style={styles.loginLink}>sign in</Link> to view your cart.
      </div>
    );
  }

  const handleQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    await updateCartItem(itemId, { quantity: newQty });
    loadCart();
  };

  const handleRemove = async (itemId) => {
    await removeCartItem(itemId);
    loadCart();
  };

  const handleClear = async () => {
    await clearCart();
    loadCart();
  };

  const validate = () => {
    const e = {};
    if (!submitForm.customerName.trim()) e.customerName = 'Name is required';
    if (!submitForm.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[0-9+\-\s]{7,15}$/.test(submitForm.phone)) e.phone = 'Enter a valid phone number';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    setServerError('');
    try {
      await submitCart(submitForm);
      setSuccess(true);
      setCart(null);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Submission failed, please retry.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading cart...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Cart</h1>

      {success && (
        <div style={styles.success}>
          ✓ Your inquiry has been submitted! We will contact you soon.
        </div>
      )}

      {!success && (!cart || cart.items.length === 0) ? (
        <div style={styles.empty}>
          Your cart is empty. <Link to="/products" style={{ color: '#e94560', textDecoration: 'none', fontWeight: 700 }}>Browse Products</Link>
        </div>
      ) : !success && (
        <>
          <button style={styles.clearBtn} onClick={handleClear}>Clear All</button>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Subtotal</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.id}>
                  <td style={styles.td}><strong>{item.productName}</strong>{item.productCode && <div style={{ color: '#888', fontSize: '0.8rem' }}>{item.productCode}</div>}</td>
                  <td style={styles.td}>{item.categoryName || '—'}</td>
                  <td style={styles.td}>{item.price ? `₹${item.price.toLocaleString()}` : '—'}</td>
                  <td style={styles.td}>
                    <div style={styles.qtyRow}>
                      <button style={styles.qtyBtn} onClick={() => handleQty(item.id, item.quantity - 1)}>−</button>
                      <span style={styles.qtyVal}>{item.quantity}</span>
                      <button style={styles.qtyBtn} onClick={() => handleQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td style={styles.td}>{item.price ? `₹${(item.price * item.quantity).toLocaleString()}` : '—'}</td>
                  <td style={styles.td}>
                    <button style={styles.removeBtn} onClick={() => handleRemove(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} style={styles.totalRow}>
                  Total Items: {cart.totalItems}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style={styles.submitCard}>
            <div style={styles.submitTitle}>Submit Inquiry for Cart Items</div>
            {serverError && <div style={styles.serverError}>{serverError}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <label style={styles.label}>Full Name *</label>
              <input style={styles.input} value={submitForm.customerName} onChange={e => setSubmitForm(f => ({ ...f, customerName: e.target.value }))} />
              {formErrors.customerName && <div style={styles.error}>{formErrors.customerName}</div>}

              <label style={styles.label}>Phone *</label>
              <input style={styles.input} value={submitForm.phone} onChange={e => setSubmitForm(f => ({ ...f, phone: e.target.value }))} />
              {formErrors.phone && <div style={styles.error}>{formErrors.phone}</div>}

              <label style={styles.label}>Address</label>
              <input style={styles.input} value={submitForm.address} onChange={e => setSubmitForm(f => ({ ...f, address: e.target.value }))} />

              <label style={styles.label}>Message (optional)</label>
              <textarea style={styles.textarea} value={submitForm.message} onChange={e => setSubmitForm(f => ({ ...f, message: e.target.value }))} placeholder="Any special requirements..." />

              <button style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }} type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
