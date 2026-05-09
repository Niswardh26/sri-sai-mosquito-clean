import React, { useEffect, useState } from 'react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadMedia } from '../../api/apiClient';
import ConfirmDialog from '../../components/ConfirmDialog';

const emptyForm = { name: '', productCode: '', description: '', price: '', material: '', style: '', categoryId: '', images: [], videos: [] };

const styles = {
  page: { maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e' },
  addBtn: { padding: '0.6rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.9rem' },
  td: { padding: '0.8rem 1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#333' },
  editBtn: { padding: '0.3rem 0.8rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
  delBtn: { padding: '0.3rem 0.8rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: '#fff', borderRadius: '10px', padding: '2rem', width: '90%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#333', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem' },
  select: { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem' },
  textarea: { width: '100%', padding: '0.55rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '80px', resize: 'vertical' },
  saveBtn: { padding: '0.65rem 2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, marginRight: '1rem' },
  cancelBtn: { padding: '0.65rem 2rem', background: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  error: { color: '#c0392b', fontSize: '0.82rem', marginTop: '-0.8rem', marginBottom: '0.8rem' },
  serverError: { color: '#c0392b', marginBottom: '1rem', fontSize: '0.9rem' },
  spinner: { textAlign: 'center', padding: '3rem', color: '#888' },
};

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p.data);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setFormErrors({}); setServerError(''); setShowForm(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name || '', productCode: p.productCode || '', description: p.description || '', price: p.price || '', material: p.material || '', style: p.style || '', categoryId: p.categoryId || '', images: p.images || [], videos: p.videos || [] });
    setFormErrors({}); setServerError(''); setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Price must be a positive number';
    if (!form.categoryId) e.categoryId = 'Category is required';
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({}); setSaving(true); setServerError('');
    const payload = { ...form, price: Number(form.price), categoryId: Number(form.categoryId) };
    try {
      if (editId) await updateProduct(editId, payload);
      else await createProduct(payload);
      setShowForm(false); load();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save product.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    await deleteProduct(confirmDelete).catch(() => {});
    setConfirmDelete(null); load();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Product Management</h1>
        <button style={styles.addBtn} onClick={openAdd}>+ Add Product</button>
      </div>

      {loading ? <div style={styles.spinner}>Loading...</div> : (
        <table style={styles.table}>
          <thead><tr>
            <th style={styles.th}>Name</th><th style={styles.th}>Code</th>
            <th style={styles.th}>Category</th><th style={styles.th}>Price</th>
            <th style={styles.th}>Material</th><th style={styles.th}>Actions</th>
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.productCode || '—'}</td>
                <td style={styles.td}>{p.categoryName}</td>
                <td style={styles.td}>{p.price ? `₹${p.price.toLocaleString()}` : '—'}</td>
                <td style={styles.td}>{p.material || '—'}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                  <button style={styles.delBtn} onClick={() => setConfirmDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {confirmDelete && <ConfirmDialog message="Delete this product? This cannot be undone." onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>{editId ? 'Edit Product' : 'Add Product'}</div>
            {serverError && <div style={styles.serverError}>{serverError}</div>}
            <form onSubmit={handleSave} noValidate>
              <label style={styles.label}>Name *</label>
              <input style={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              {formErrors.name && <div style={styles.error}>{formErrors.name}</div>}

              <label style={styles.label}>Product Code</label>
              <input style={styles.input} value={form.productCode} onChange={e => setForm(f => ({ ...f, productCode: e.target.value }))} />

              <label style={styles.label}>Category *</label>
              <select style={styles.select} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {formErrors.categoryId && <div style={styles.error}>{formErrors.categoryId}</div>}

              <label style={styles.label}>Price *</label>
              <input style={styles.input} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              {formErrors.price && <div style={styles.error}>{formErrors.price}</div>}

              <label style={styles.label}>Material</label>
              <input style={styles.input} value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} />

              <label style={styles.label}>Style</label>
              <input style={styles.input} value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))} />

              <label style={styles.label}>Description</label>
              <textarea style={styles.textarea} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

              <label style={styles.label}>Images (upload from device)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ marginBottom: '0.5rem', display: 'block' }}
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  if (!files.length) return;
                  setUploadingImages(true);
                  try {
                    const urls = await Promise.all(files.map(f => uploadMedia(f).then(r => r.data.url)));
                    setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
                  } catch { setServerError('Image upload failed.'); }
                  finally { setUploadingImages(false); }
                }}
              />
              {uploadingImages && <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Uploading images...</div>}
              {form.images.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {form.images.map((url, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={url} alt="preview" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                      <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <label style={styles.label}>Videos (upload from device)</label>
              <input
                type="file"
                accept="video/*"
                multiple
                style={{ marginBottom: '0.5rem', display: 'block' }}
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  if (!files.length) return;
                  setUploadingVideos(true);
                  try {
                    const urls = await Promise.all(files.map(f => uploadMedia(f).then(r => r.data.url)));
                    setForm(prev => ({ ...prev, videos: [...prev.videos, ...urls] }));
                  } catch { setServerError('Video upload failed.'); }
                  finally { setUploadingVideos(false); }
                }}
              />
              {uploadingVideos && <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Uploading videos...</div>}
              {form.videos.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {form.videos.map((url, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f5f5f5', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#555', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🎥 {url.split('/').pop()}</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, videos: f.videos.filter((_, j) => j !== i) }))} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem' }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <button style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }} type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button style={styles.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
