import React, { useEffect, useState } from 'react';

const slides = [
  { title: 'Sri Sai Mosquito Enterprises', sub: 'Premium Doors & Windows for Every Home', bg: '#1a1a2e' },
  { title: 'Quality You Can Trust', sub: 'Explore our wide range of Doors and Windows', bg: '#16213e' },
  { title: 'Crafted to Perfection', sub: 'Style, Strength & Elegance in Every Product', bg: '#0f3460' },
];

const styles = {
  wrapper: { position: 'relative', height: '420px', overflow: 'hidden' },
  slide: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'opacity 0.8s ease', padding: '2rem' },
  title: { fontSize: '2.4rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center', color: '#e94560' },
  sub: { fontSize: '1.2rem', textAlign: 'center', color: '#ccc' },
  dots: { position: 'absolute', bottom: '1.2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #fff', cursor: 'pointer' },
};

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.wrapper}>
      {slides.map((s, i) => (
        <div key={i} style={{ ...styles.slide, background: s.bg, opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <div style={styles.title}>{s.title}</div>
          <div style={styles.sub}>{s.sub}</div>
        </div>
      ))}
      <div style={styles.dots}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ ...styles.dot, background: i === current ? '#e94560' : 'transparent' }} />
        ))}
      </div>
    </div>
  );
}
