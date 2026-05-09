import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { filterProducts, getCart } from '../api/apiClient';

const styles = {
  nav: { background: '#1a1a2e', color: '#fff', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 1000 },
  brand: { color: '#e94560', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' },
  links: { display: 'flex', gap: '1.5rem', listStyle: 'none', alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' },
  searchBox: { display: 'flex', gap: '0.5rem' },
  input: { padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none', fontSize: '0.9rem' },
  btn: { padding: '0.4rem 0.8rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  adminLink: { color: '#e94560', fontWeight: 600 },
  cartBtn: { position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '1.3rem', display: 'flex', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: '-6px', right: '-8px', background: '#e94560', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
};

export default function Navbar() {
  const { user, isAdmin, logoutUser } = useAuth();
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getCart().then(res => setCartCount(res.data?.totalItems || 0)).catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?name=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Sri Sai Mosquito Enterprises</Link>
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/products" style={styles.link}>Products</Link></li>
        <li><Link to="/about" style={styles.link}>About Us</Link></li>
        <li><Link to="/contact" style={styles.link}>Contact Us</Link></li>
        {isAdmin() && <li><Link to="/admin/dashboard" style={styles.adminLink}>Admin</Link></li>}
        {user && (
          <li>
            <button style={styles.cartBtn} onClick={() => navigate('/cart')} title="Cart">
              🛒
              {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
            </button>
          </li>
        )}
        {user ? (
          <li><button onClick={logoutUser} style={{ ...styles.btn, background: '#555' }}>Logout</button></li>
        ) : (
          <>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
            <li><Link to="/register" style={{ ...styles.btn, textDecoration: 'none', borderRadius: '4px', padding: '0.4rem 0.8rem' }}>Register</Link></li>
          </>
        )}
      </ul>
      <form onSubmit={handleSearch} style={styles.searchBox}>
        <input style={styles.input} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit" style={styles.btn}>Search</button>
      </form>
    </nav>
  );
}

