import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getInquiries, getAllOrders } from '../../api/apiClient';

const styles = {
  page: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' },
  heading: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '2rem' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem', textAlign: 'center' },
  count: { fontSize: '3rem', fontWeight: 700, color: '#e94560' },
  label: { color: '#555', marginTop: '0.5rem', fontSize: '1rem' },
  links: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  link: { padding: '0.8rem 2rem', background: '#1a1a2e', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 },
  spinner: { textAlign: 'center', padding: '3rem', color: '#888' },
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: '-', inquiries: '-', orders: '-' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getProducts(), getInquiries(), getAllOrders()]).then(([p, i, o]) => {
      setCounts({
        products: p.status === 'fulfilled' ? p.value.data.length : 'N/A',
        inquiries: i.status === 'fulfilled' ? i.value.data.length : 'N/A',
        orders: o.status === 'fulfilled' ? o.value.data.length : 'N/A',
      });
      setLoading(false);
    });
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      {loading ? <div style={styles.spinner}>Loading...</div> : (
        <div style={styles.cards}>
          <div style={styles.card}><div style={styles.count}>{counts.products}</div><div style={styles.label}>Total Products</div></div>
          <div style={styles.card}><div style={styles.count}>{counts.inquiries}</div><div style={styles.label}>Total Inquiries</div></div>
          <div style={styles.card}><div style={styles.count}>{counts.orders}</div><div style={styles.label}>Total Orders</div></div>
        </div>
      )}
      <div style={styles.links}>
        <Link to="/admin/products" style={styles.link}>Manage Products</Link>
        <Link to="/admin/inquiries" style={styles.link}>Manage Inquiries</Link>
        <Link to="/admin/orders" style={styles.link}>Manage Orders</Link>
      </div>
    </div>
  );
}
