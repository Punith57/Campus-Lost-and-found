import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, getStats } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function HomePage() {
  const [recentItems, setRecentItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStats(),
      getItems({ limit: 6, status: 'open' }),
    ]).then(([statsRes, itemsRes]) => {
      setStats(statsRes.data);
      setRecentItems(itemsRes.data.items);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">🏫 Campus Lost &amp; Found Portal</div>
          <h1 className="hero-title">
            Lost Something?<br />
            <span className="gradient-text">We'll Help You Find It.</span>
          </h1>
          <p className="hero-sub">
            Browse reported lost and found items from across campus. Submit a request to collect your belongings or help return items to their owners.
          </p>
          <div className="hero-actions">
            <Link to="/items" className="btn btn-primary btn-lg" id="hero-browse-btn">
              🔍 Browse Items
            </Link>
            <Link to="/post" className="btn btn-ghost btn-lg" id="hero-post-btn">
              📢 Report an Item
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="container">
        {loading ? (
          <div className="stats-row">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card stat-card">
                <div className="skeleton" style={{ height: '40px', width: '60%', margin: '0 auto 8px' }} />
                <div className="skeleton" style={{ height: '14px', width: '80%', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="stats-row">
            <div className="glass-card stat-card animate-in">
              <div className="stat-number">{stats.totalLost}</div>
              <div className="stat-label">Items Lost</div>
            </div>
            <div className="glass-card stat-card animate-in">
              <div className="stat-number">{stats.totalFound}</div>
              <div className="stat-label">Items Found</div>
            </div>
            <div className="glass-card stat-card animate-in">
              <div className="stat-number">{stats.totalOpen}</div>
              <div className="stat-label">Still Open</div>
            </div>
            <div className="glass-card stat-card animate-in">
              <div className="stat-number">{stats.totalResolved}</div>
              <div className="stat-label">Reunited 🎉</div>
            </div>
          </div>
        ) : null}
      </section>

      {/* ── Recent Items ── */}
      <section className="container" style={{ paddingBottom: '60px' }}>
        <div className="section-header">
          <h2 className="section-title">
            Recent Items
            {!loading && <span>{recentItems.length} open</span>}
          </h2>
          <Link to="/items" className="btn btn-ghost btn-sm">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="items-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="skeleton" style={{ height: '180px', borderRadius: '14px 14px 0 0' }} />
                <div style={{ padding: '18px' }}>
                  <div className="skeleton" style={{ height: '18px', marginBottom: '10px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <div className="items-grid">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3 className="empty-title">No items posted yet</h3>
            <p className="empty-sub">Be the first to report a lost or found item on campus!</p>
            <Link to="/post" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Report First Item
            </Link>
          </div>
        )}
      </section>

      {/* ── How It Works ── */}
      <section style={{ background: 'var(--bg-secondary)', padding: '60px 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '36px' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { icon: '📢', step: '01', title: 'Report an Item', desc: 'Post a lost or found item with photos, location and description.' },
              { icon: '🔍', step: '02', title: 'Browse Listings', desc: 'Search and filter items by type, category and location.' },
              { icon: '📩', step: '03', title: 'Submit a Request', desc: "See something that's yours? Submit a claim request with your details." },
              { icon: '🤝', step: '04', title: 'Get Reunited', desc: 'The poster reviews and contacts you to arrange a handover.' },
            ].map((s) => (
              <div key={s.step} className="glass-card animate-in" style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-1)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Step {s.step}</div>
                <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">🏫 CampusFind — Helping students reconnect with their belongings</p>
        </div>
      </footer>
    </div>
  );
}
