import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addCartItem } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const styles = {
  card: { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  img: { width: '100%', height: '180px', objectFit: 'cover', background: '#eee' },
  body: { padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  name: { fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' },
  badge: { display: 'inline-block', background: '#e94560', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px' },
  price: { color: '#333', fontWeight: 600, fontSize: '1rem' },
  meta: { color: '#777', fontSize: '0.85rem' },
  btnRow: { display: 'flex', gap: '0.5rem', marginTop: 'auto' },
  btn: { flex: 1, padding: '0.5rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block', fontSize: '0.88rem' },
  cartBtn: { flex: 1, padding: '0.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 },
  added: { color: '#27ae60', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.3rem' },
};

export default function ProductCard({ product }) {
  const img = product.images?.[0];
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await addCartItem({ productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {} finally { setAdding(false); }
  };

  return (
    <div style={styles.card}>
      {img ? <img src={img} alt={product.name} style={styles.img} /> : <div style={{ ...styles.img, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>}
      <div style={styles.body}>
        <span style={styles.badge}>{product.categoryName}</span>
        <div style={styles.name}>{product.name}</div>
        {product.material && <div style={styles.meta}>Material: {product.material}</div>}
        {product.style && <div style={styles.meta}>Style: {product.style}</div>}
        <div style={styles.price}>{product.price ? `₹${product.price.toLocaleString()}` : 'Price on request'}</div>
        <div style={styles.btnRow}>
          <Link to={`/products/${product.id}`} style={styles.btn}>View Details</Link>
          <button style={{ ...styles.cartBtn, opacity: adding ? 0.7 : 1 }} onClick={handleAddToCart} disabled={adding}>
            {adding ? '...' : '🛒 Add'}
          </button>
        </div>
        {added && <div style={styles.added}>✓ Added to cart!</div>}
      </div>
    </div>
  );
}

