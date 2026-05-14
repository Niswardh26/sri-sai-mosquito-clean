import React from 'react';

const styles = {
  page: { maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' },
  hero: { background: '#1a1a2e', color: '#fff', borderRadius: '10px', padding: '3rem', textAlign: 'center', marginBottom: '2.5rem' },
  heroTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#e94560', marginBottom: '1rem' },
  heroSub: { color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' },
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem', marginBottom: '1.5rem' },
  cardTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.8rem' },
  text: { color: '#555', lineHeight: '1.8' },
  contactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' },
  contactItem: { background: '#f9f9f9', padding: '1rem', borderRadius: '8px' },
  contactLabel: { fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem', marginBottom: '0.3rem' },
  contactVal: { color: '#555', fontSize: '0.95rem' },
};

export default function AboutUs() {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroTitle}>About Sri Sai Mosquito Enterprises</div>
        <p style={styles.heroSub}>
          Your trusted partner for premium quality doors and windows since inception.
          We bring together craftsmanship, innovation, and reliability.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Our Story</div>
        <p style={styles.text}>
          Sri Sai Mosquito Enterprises was founded with a simple vision: to provide homeowners and
          businesses with high-quality doors and windows that combine aesthetics, security, and durability.
          Over the years, we have grown to become a trusted name in the region, serving hundreds of
          satisfied customers across residential and commercial projects.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Our Mission</div>
        <p style={styles.text}>
          To deliver superior doors and windows products that meet the highest standards of quality,
          at competitive prices, backed by exceptional customer service. We believe every home deserves
          the best — and we're here to make that possible.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Contact Details</div>
        <div style={styles.contactGrid}>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Email</div>
            <div style={styles.contactVal}>info@srisaimosquito.com</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Phone</div>
            <div style={styles.contactVal}>+91 99891 86378</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Working Hours</div>
            <div style={styles.contactVal}>Mon–Sat, 9 AM – 6 PM</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>Location</div>
            <div style={styles.contactVal}>Hyderabad, Telangana, India</div>
          </div>
        </div>
      </div>
    </div>
  );
}
