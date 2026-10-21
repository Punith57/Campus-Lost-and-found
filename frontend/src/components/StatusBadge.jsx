import React from 'react';

export default function StatusBadge({ type, status }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {type && (
        <span className={`badge badge-${type}`}>
          {type === 'lost' ? '❌' : '✅'} {type}
        </span>
      )}
      {status && (
        <span className={`badge badge-${status}`}>
          {status === 'open' ? '🟢' : '⚫'} {status}
        </span>
      )}
    </div>
  );
}
