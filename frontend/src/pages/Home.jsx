import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api/apiClient';

const styles = {
  section: { maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem' },
  heading: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  cta: { textAlign: 'center', marginTop: '2rem' },
  ctaBtn: { padding: '0.8rem 2.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  about: { background: '#1a1a2e', color: '#fff', padding: '3rem 1.5rem', textAlign: 'center' },
  aboutText: { maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', color: '#ccc', marginBottom: '1.5rem' },
  spinner: { textAlign: 'center', padding: '3rem', color: '#888' },
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(r => setProducts(r.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Banner />

      <div style={styles.section}>
        <h2 style={styles.heading}>Featured Products</h2>
        {loading ? <div style={styles.spinner}>Loading products...</div> : (
          <>
            <div style={styles.grid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={styles.cta}>
              <Link to="/products" style={styles.ctaBtn}>View All Products</Link>
            </div>
          </>
        )}
      </div>

      <div style={styles.about}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: '#e94560' }}>About Us</h2>
        <p style={styles.aboutText}>
          Sri Sai Mosquito Enterprises is a trusted name in premium quality doors and windows.
          With years of experience and a commitment to excellence, we deliver products that combine
          durability, style, and security for homes and businesses alike.
        </p>
        <Link to="/about" style={styles.ctaBtn}>Learn More</Link>
      </div>

      <div style={{ ...styles.section, textAlign: 'center' }}>
        <h2 style={styles.heading}>Have a Query?</h2>
        <p style={{ color: '#555', marginBottom: '1.5rem' }}>Get in touch with us — we're happy to help you find the right product.</p>
        <Link to="/contact" style={styles.ctaBtn}>Contact Us</Link>
      </div>
    </div>
  );
}
