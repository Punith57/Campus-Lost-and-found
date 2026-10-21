import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const CATEGORY_ICONS = {
  'Electronics': '💻',
  'Clothing': '👕',
  'Books & Stationery': '📚',
  'ID & Cards': '💳',
  'Keys': '🔑',
  'Bags & Wallets': '👜',
  'Jewelry & Accessories': '💍',
  'Sports Equipment': '⚽',
  'Other': '📦',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const icon = CATEGORY_ICONS[item.category] || '📦';

  return (
    <div
      className="glass-card item-card animate-in"
      onClick={() => navigate(`/items/${item._id}`)}
      id={`item-card-${item._id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/items/${item._id}`)}
    >
      {item.imagePath ? (
        <img
          src={`http://localhost:5000${item.imagePath}`}
          alt={item.title}
          className="item-card-image"
        />
      ) : (
        <div className="item-card-image-placeholder">{icon}</div>
      )}

      <div className="item-card-body">
        <div className="item-card-top">
          <h3 className="item-card-title">{item.title}</h3>
          <div className="item-card-badges">
            <StatusBadge type={item.type} status={item.status} />
          </div>
        </div>

        <p className="item-card-desc">{item.description}</p>

        <div className="item-card-meta">
          <span className="item-meta-item">
            📍 {item.location}
          </span>
          <span className="item-meta-item">
            {icon} {item.category}
          </span>
        </div>

        <div className="item-card-footer">
          <span className="item-card-date">{formatDate(item.date)}</span>
          <span className="btn btn-ghost btn-sm">View Details →</span>
        </div>
      </div>
    </div>
  );
}
