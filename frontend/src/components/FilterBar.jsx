import React from 'react';

const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Books & Stationery',
  'ID & Cards',
  'Keys',
  'Bags & Wallets',
  'Jewelry & Accessories',
  'Sports Equipment',
  'Other',
];

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="glass-card filter-bar">
      {/* Search */}
      <div className="filter-search">
        <span className="search-icon">🔍</span>
        <input
          id="search-input"
          type="text"
          className="form-input"
          placeholder="Search by title, description, or location..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      {/* Type Toggle */}
      <div className="type-toggle">
        {['all', 'lost', 'found'].map((t) => (
          <button
            key={t}
            id={`filter-type-${t}`}
            className={`type-toggle-btn ${filters.type === t ? `active-${t}` : ''}`}
            onClick={() => onFilterChange('type', t)}
          >
            {t === 'all' ? 'All' : t === 'lost' ? '❌ Lost' : '✅ Found'}
          </button>
        ))}
      </div>

      {/* Category */}
      <div className="filter-selects">
        <select
          id="filter-category"
          className="form-select filter-select"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c === 'All Categories' ? 'all' : c}>
              {c}
            </option>
          ))}
        </select>

        <select
          id="filter-status"
          className="form-select filter-select"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
    </div>
  );
}
