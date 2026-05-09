import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, addCartItem } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const styles = {
  page: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' },
  back: { color: '#e94560', textDecoration: 'none', fontWeight: 600, marginBottom: '1.5rem', display: 'inline-block' },
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', overflow: 'hidden' },
  gallery: { display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1.5rem', background: '#f9f9f9' },
  img: { height: '260px', minWidth: '320px', objectFit: 'cover', borderRadius: '8px' },
  video: { height: '260px', minWidth: '320px', borderRadius: '8px', background: '#000' },
  noImg: { height: '260px', minWidth: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', borderRadius: '8px', color: '#aaa', fontSize: '1rem' },
  info: { padding: '2rem' },
  badge: { display: 'inline-block', background: '#e94560', color: '#fff', fontSize: '0.8rem', padding: '3px 12px', borderRadius: '12px', marginBottom: '0.8rem' },
  name: { fontSize: '2rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.5rem' },
  code: { color: '#888', fontSize: '0.9rem', marginBottom: '1rem' },
  price: { fontSize: '1.6rem', fontWeight: 700, color: '#e94560', marginBottom: '1.2rem' },
  desc: { color: '#555', lineHeight: '1.7', marginBottom: '1.5rem' },
  meta: { display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  metaItem: { fontSize: '0.95rem', color: '#444' },
  btnRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' },
  ctaBtn: { padding: '0.8rem 2rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', textDecoration: 'none', display: 'inline-block' },
  cartBtn: { padding: '0.8rem 2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 },
  addedMsg: { color: '#27ae60', fontWeight: 600, fontSize: '0.95rem' },
  spinner: { textAlign: 'center', padding: '4rem', color: '#888' },
  error: { textAlign: 'center', padding: '4rem', color: '#c0392b' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    getProductById(id)
      .then(r => setProduct(r.data))
      .catch(err => setError(err.response?.status === 404 ? 'Product not found.' : 'Something went wrong, please retry.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await addCartItem({ productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {} finally { setAdding(false); }
  };

  if (loading) return <div style={styles.spinner}>Loading product...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.page}>
      <Link to="/products" style={styles.back}>← Back to Products</Link>
      <div style={styles.card}>
        <div style={styles.gallery}>
          {product.images?.length
            ? product.images.map((img, i) => <img key={i} src={img} alt={product.name} style={styles.img} />)
            : <div style={styles.noImg}>No Images Available</div>}
          {product.videos?.map((vid, i) => (
            <video key={i} src={vid} controls style={styles.video} />
          ))}
        </div>
        <div style={styles.info}>
          <span style={styles.badge}>{product.categoryName}</span>
          <div style={styles.name}>{product.name}</div>
          {product.productCode && <div style={styles.code}>Code: {product.productCode}</div>}
          <div style={styles.price}>{product.price ? `₹${product.price.toLocaleString()}` : 'Price on request'}</div>
          {product.description && <div style={styles.desc}>{product.description}</div>}
          <div style={styles.meta}>
            {product.material && <div style={styles.metaItem}><strong>Material:</strong> {product.material}</div>}
            {product.style && <div style={styles.metaItem}><strong>Style:</strong> {product.style}</div>}
          </div>
          <div style={styles.btnRow}>
            <button style={{ ...styles.cartBtn, opacity: adding ? 0.7 : 1 }} onClick={handleAddToCart} disabled={adding}>
              {adding ? 'Adding...' : '🛒 Add to Cart'}
            </button>
            <Link to={`/contact?product=${encodeURIComponent(product.name)}`} style={styles.ctaBtn}>Send Inquiry</Link>
            {added && <span style={styles.addedMsg}>✓ Added to cart!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
