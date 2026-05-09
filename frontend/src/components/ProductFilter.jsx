import React, { useEffect, useState } from 'react';
import { getCategories } from '../api/apiClient';

const styles = {
  sidebar: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: '220px' },
  label: { display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a2e', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  select: { width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  row: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.6rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  reset: { width: '100%', padding: '0.6rem', background: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '0.5rem' },
  heading: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: '#1a1a2e' },
};

export default function ProductFilter({ filters, onChange, onApply, onReset }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <div style={styles.sidebar}>
      <div style={styles.heading}>Filter Products</div>

      <label style={styles.label}>Search by Name</label>
      <input style={styles.input} placeholder="Product name..." value={filters.name} onChange={e => onChange('name', e.target.value)} />

      <label style={styles.label}>Category</label>
      <select style={styles.select} value={filters.categoryId} onChange={e => onChange('categoryId', e.target.value)}>
        <option value="">All Categories</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <label style={styles.label}>Material</label>
      <input style={styles.input} placeholder="e.g. Wood, Aluminium..." value={filters.material} onChange={e => onChange('material', e.target.value)} />

      <label style={styles.label}>Style</label>
      <input style={styles.input} placeholder="e.g. Modern, Classic..." value={filters.style} onChange={e => onChange('style', e.target.value)} />

      <label style={styles.label}>Price Range</label>
      <div style={styles.row}>
        <input style={{ ...styles.input, marginBottom: 0 }} type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => onChange('minPrice', e.target.value)} />
        <input style={{ ...styles.input, marginBottom: 0 }} type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => onChange('maxPrice', e.target.value)} />
      </div>

      <button style={styles.btn} onClick={onApply}>Apply Filters</button>
      <button style={styles.reset} onClick={onReset}>Reset</button>
    </div>
  );
}
