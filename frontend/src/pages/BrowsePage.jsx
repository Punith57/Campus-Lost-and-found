import React, { useEffect, useState, useCallback } from 'react';
import { getItems } from '../services/api';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';
import { Link } from 'react-router-dom';

const DEFAULT_FILTERS = { search: '', type: 'all', category: 'all', status: 'all' };

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 350);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.status !== 'all' && { status: filters.status }),
      };
      const res = await getItems(params);
      setItems(res.data.items);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.type, filters.category, filters.status]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFilterChange = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-header-title">Browse Items</h1>
          <p className="page-header-sub">
            {loading ? 'Loading...' : `${total} item${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="items-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="skeleton" style={{ height: '180px', borderRadius: '14px 14px 0 0' }} />
                <div style={{ padding: '18px' }}>
                  <div className="skeleton" style={{ height: '18px', marginBottom: '10px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="items-grid">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  id="pagination-prev"
                >
                  ‹
                </button>
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    id={`pagination-page-${n}`}
                    className={`pagination-btn${page === n ? ' active' : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  id="pagination-next"
                >
                  ›
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No items found</h3>
            <p className="empty-sub">Try adjusting your filters or be the first to report an item!</p>
            <Link to="/post" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Report an Item
            </Link>
          </div>
        )}
      </div>

      <footer className="footer" style={{ marginTop: '60px' }}>
        <div className="container">
          <p className="footer-text">🏫 CampusFind — Helping students reconnect with their belongings</p>
        </div>
      </footer>
    </div>
  );
}
