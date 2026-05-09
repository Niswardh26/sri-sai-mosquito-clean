import React, { useEffect, useState } from 'react';
import { getInquiries, getInquiryById, deleteInquiry } from '../../api/apiClient';
import ConfirmDialog from '../../components/ConfirmDialog';

const styles = {
  page: { maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' },
  heading: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.9rem' },
  td: { padding: '0.8rem 1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#333' },
  viewBtn: { padding: '0.3rem 0.8rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
  delBtn: { padding: '0.3rem 0.8rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: '#fff', borderRadius: '10px', padding: '2rem', width: '90%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.2rem' },
  row: { marginBottom: '0.8rem' },
  rowLabel: { fontWeight: 600, color: '#555', fontSize: '0.85rem' },
  rowVal: { color: '#333', fontSize: '0.95rem', marginTop: '0.2rem' },
  closeBtn: { marginTop: '1.5rem', padding: '0.6rem 1.5rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  spinner: { textAlign: 'center', padding: '3rem', color: '#888' },
  badge: { display: 'inline-block', background: '#e94560', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px' },
};

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    getInquiries().then(r => setInquiries(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleView = (id) => {
    setDetailLoading(true);
    getInquiryById(id).then(r => setDetail(r.data)).catch(() => {}).finally(() => setDetailLoading(false));
  };

  const handleDelete = async () => {
    await deleteInquiry(confirmDelete).catch(() => {});
    setConfirmDelete(null); load();
  };

  const formatDate = (dt) => dt ? new Date(dt).toLocaleString() : '—';

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Inquiry Management</h1>
      {loading ? <div style={styles.spinner}>Loading...</div> : (
        <table style={styles.table}>
          <thead><tr>
            <th style={styles.th}>Customer</th><th style={styles.th}>Phone</th>
            <th style={styles.th}>Product Interest</th><th style={styles.th}>Submitted</th>
            <th style={styles.th}>Actions</th>
          </tr></thead>
          <tbody>
            {inquiries.map(inq => (
              <tr key={inq.id}>
                <td style={styles.td}>{inq.customerName}</td>
                <td style={styles.td}>{inq.phone}</td>
                <td style={styles.td}>{inq.productInterest || '—'}</td>
                <td style={styles.td}>{formatDate(inq.createdAt)}</td>
                <td style={styles.td}>
                  <button style={styles.viewBtn} onClick={() => handleView(inq.id)}>View</button>
                  <button style={styles.delBtn} onClick={() => setConfirmDelete(inq.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {confirmDelete && <ConfirmDialog message="Delete this inquiry? This cannot be undone." onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}

      {(detail || detailLoading) && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {detailLoading ? <div style={{ textAlign: 'center' }}>Loading...</div> : detail && (
              <>
                <div style={styles.modalTitle}>Inquiry Detail</div>
                {[['Customer Name', detail.customerName], ['Phone', detail.phone], ['Address', detail.address], ['Product Interest', detail.productInterest], ['Message', detail.message], ['Submitted', formatDate(detail.createdAt)]].map(([label, val]) => (
                  <div key={label} style={styles.row}>
                    <div style={styles.rowLabel}>{label}</div>
                    <div style={styles.rowVal}>{val || '—'}</div>
                  </div>
                ))}
                <button style={styles.closeBtn} onClick={() => setDetail(null)}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
