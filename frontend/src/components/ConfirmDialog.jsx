import React from 'react';

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  box: { background: '#fff', borderRadius: '8px', padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center' },
  title: { fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.8rem', color: '#1a1a2e' },
  msg: { color: '#555', marginBottom: '1.5rem' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center' },
  confirm: { padding: '0.6rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  cancel: { padding: '0.6rem 1.5rem', background: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <div style={styles.title}>Confirm Action</div>
        <div style={styles.msg}>{message}</div>
        <div style={styles.actions}>
          <button style={styles.cancel} onClick={onCancel}>Cancel</button>
          <button style={styles.confirm} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
