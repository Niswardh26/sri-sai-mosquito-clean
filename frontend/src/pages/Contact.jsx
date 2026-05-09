import React from 'react';
import { useSearchParams } from 'react-router-dom';
import InquiryForm from '../components/InquiryForm';

const styles = {
  page: { maxWidth: '650px', margin: '3rem auto', padding: '0 1.5rem' },
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', padding: '2.5rem' },
  heading: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.5rem' },
  sub: { color: '#666', marginBottom: '2rem' },
};

export default function Contact() {
  const [params] = useSearchParams();
  const productInterest = params.get('product') || '';
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Contact Us</h1>
        <p style={styles.sub}>Fill in the form below and we'll get back to you as soon as possible.</p>
        <InquiryForm defaultProductInterest={productInterest} />
      </div>
    </div>
  );
}
