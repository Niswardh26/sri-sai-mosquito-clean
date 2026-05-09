import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import { filterProducts } from '../api/apiClient';

const EMPTY = { name: '', categoryId: '', material: '', style: '', minPrice: '', maxPrice: '' };

const styles = {
  page: { maxWidth: '1300px', margin: '2rem auto', padding: '0 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' },
  main: { flex: 1 },
  heading: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  spinner: { padding: '3rem', textAlign: 'center', color: '#888' },
  empty: { padding: '3rem', textAlign: 'center', color: '#aaa', fontSize: '1.1rem' },
  error: { color: '#c0392b', padding: '1rem' },
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ ...EMPTY, name: searchParams.get('name') || '' });

  const fetchProducts = (f = filters) => {
    setLoading(true);
    setError('');
    const params = {};
    if (f.name) params.name = f.name;
    if (f.categoryId) params.categoryId = f.categoryId;
    if (f.material) params.material = f.material;
    if (f.style) params.style = f.style;
    if (f.minPrice) params.minPrice = f.minPrice;
    if (f.maxPrice) params.maxPrice = f.maxPrice;
    filterProducts(params)
      .then(r => setProducts(r.data))
      .catch(() => setError('Something went wrong, please retry.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const handleApply = () => fetchProducts();
  const handleReset = () => { const f = { ...EMPTY }; setFilters(f); fetchProducts(f); };

  return (
    <div style={styles.page}>
      <ProductFilter filters={filters} onChange={handleChange} onApply={handleApply} onReset={handleReset} />
      <div style={styles.main}>
        <h1 style={styles.heading}>Our Products</h1>
        {error && <div style={styles.error}>{error}</div>}
        {loading ? <div style={styles.spinner}>Loading products...</div> : (
          products.length === 0
            ? <div style={styles.empty}>No products found. Try adjusting your filters.</div>
            : <div style={styles.grid}>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </div>
    </div>
  );
}
