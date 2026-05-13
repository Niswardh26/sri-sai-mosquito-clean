import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { filterProducts, getCart } from '../api/apiClient';
import './Navbar.css';

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
  mobileMenu: { display: 'none', flexDirection: 'column', position: 'absolute', top: '64px', left: 0, right: 0, background: '#1a1a2e', padding: '1rem', gap: '1rem' },
  hamburger: { display: 'none', flexDirection: 'column', cursor: 'pointer', gap: '4px' },
  bar: { width: '25px', height: '3px', background: '#fff' },
  '@media (max-width: 768px)': {
    nav: { padding: '0 1rem', flexWrap: 'wrap', height: 'auto', minHeight: '64px' },
    links: { display: 'none' },
    searchBox: { order: 2, width: '100%', justifyContent: 'center', marginTop: '0.5rem' },
    mobileMenu: { display: 'flex' },
    hamburger: { display: 'flex' },
  },
};

export default function Navbar() {
  const { user, isAdmin, logoutUser } = useAuth();
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="nav">
      <Link to="/" className="brand">Sri Sai Mosquito Enterprises</Link>
      <div className="hamburger" onClick={toggleMobileMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <ul className={`links ${isMobileMenuOpen ? 'mobileMenu open' : ''}`}>
        <li><Link to="/" className="link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
        <li><Link to="/products" className="link" onClick={() => setIsMobileMenuOpen(false)}>Products</Link></li>
        <li><Link to="/about" className="link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link></li>
        <li><Link to="/contact" className="link" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link></li>
        {isAdmin() && <li><Link to="/admin/dashboard" className="adminLink" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link></li>}
        {user && (
          <li>
            <button className="cartBtn" onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }} title="Cart">
              🛒
              {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
            </button>
          </li>
        )}
        {user ? (
          <li><button onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }} className="btn" style={{ background: '#555' }}>Logout</button></li>
        ) : (
          <>
            <li><Link to="/login" className="link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link></li>
            <li><Link to="/register" className="btn" style={{ textDecoration: 'none', borderRadius: '4px', padding: '0.4rem 0.8rem' }} onClick={() => setIsMobileMenuOpen(false)}>Register</Link></li>
          </>
        )}
      </ul>
      <form onSubmit={handleSearch} className="searchBox">
        <input className="input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit" className="btn">Search</button>
      </form>
    </nav>
  );
}

