import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemById, updateItemStatus } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ClaimModal from '../components/ClaimModal';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = {
  'Electronics': '💻', 'Clothing': '👕', 'Books & Stationery': '📚',
  'ID & Cards': '💳', 'Keys': '🔑', 'Bags & Wallets': '👜',
  'Jewelry & Accessories': '💍', 'Sports Equipment': '⚽', 'Other': '📦',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    getItemById(id)
      .then((res) => setItem(res.data))
      .catch(() => { toast.error('Item not found'); navigate('/items'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleMarkResolved = async () => {
    const newStatus = item.status === 'open' ? 'resolved' : 'open';
    setResolving(true);
    try {
      const res = await updateItemStatus(id, newStatus);
      setItem(res.data);
      toast.success(newStatus === 'resolved' ? '✅ Item marked as resolved!' : '🔄 Item reopened!');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: '40px' }}>
          <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Loading item details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const icon = CATEGORY_ICONS[item.category] || '📦';

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '36px', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>›</span>
          <Link to="/items" style={{ color: 'var(--text-muted)' }}>Browse Items</Link>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{item.title}</span>
        </div>

        <div className="detail-layout animate-in">
          {/* ── Left column ── */}
          <div>
            {item.imagePath ? (
              <img
                src={`http://localhost:5000${item.imagePath}`}
                alt={item.title}
                className="detail-image"
              />
            ) : (
              <div className="detail-image-placeholder">{icon}</div>
            )}

            <div style={{ marginTop: '28px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '14px', color: 'var(--text-secondary)' }}>Description</h2>
              <div className="glass-card" style={{ padding: '20px' }}>
                <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>{item.description}</p>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="detail-sidebar">
            {/* Title + badges */}
            <div>
              <div style={{ marginBottom: '12px' }}>
                <StatusBadge type={item.type} status={item.status} />
              </div>
              <h1 className="detail-title">{item.title}</h1>
            </div>

            {/* Meta grid */}
            <div className="detail-meta-grid">
              <div className="detail-meta-block">
                <div className="detail-meta-label">Category</div>
                <div className="detail-meta-value">{icon} {item.category}</div>
              </div>
              <div className="detail-meta-block">
                <div className="detail-meta-label">Location</div>
                <div className="detail-meta-value">📍 {item.location}</div>
              </div>
              <div className="detail-meta-block" style={{ gridColumn: '1 / -1' }}>
                <div className="detail-meta-label">
                  {item.type === 'lost' ? 'Date Lost' : 'Date Found'}
                </div>
                <div className="detail-meta-value">📅 {formatDate(item.date)}</div>
              </div>
            </div>

            {/* Contact card */}
            <div className="glass-card sidebar-card">
              <h3>Posted By</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--accent-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    {item.contactName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{item.contactName}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Posted {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div>
                  <div style={{ fontSize: '14px', color: 'var(--accent-1)', wordBreak: 'break-all' }}>{item.contactEmail}</div>
                </div>

                {item.contactPhone && (
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</div>
                    <div style={{ fontSize: '14px' }}>{item.contactPhone}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {item.status === 'open' && (
              <button
                id="claim-item-btn"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setShowModal(true)}
              >
                {item.type === 'lost' ? '🙋 I Found This!' : '📦 I Want to Collect This'}
              </button>
            )}

            <button
              id="mark-resolved-btn"
              className={`btn btn-sm ${item.status === 'open' ? 'btn-ghost' : 'btn-danger'}`}
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleMarkResolved}
              disabled={resolving}
            >
              {resolving ? '...' : item.status === 'open' ? '✅ Mark as Resolved' : '🔄 Reopen Item'}
            </button>

            {item.status === 'resolved' && (
              <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--resolved-color)' }}>
                  ⚫ This item has been resolved and is no longer accepting new requests.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ClaimModal item={item} onClose={() => setShowModal(false)} />
      )}

      <footer className="footer">
        <div className="container">
          <p className="footer-text">🏫 CampusFind — Helping students reconnect with their belongings</p>
        </div>
      </footer>
    </div>
  );
}
