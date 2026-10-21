import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Electronics', 'Clothing', 'Books & Stationery', 'ID & Cards',
  'Keys', 'Bags & Wallets', 'Jewelry & Accessories', 'Sports Equipment', 'Other',
];

const INITIAL_FORM = {
  type: '',
  title: '',
  description: '',
  category: '',
  location: '',
  date: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
};

export default function PostItemPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.type) e.type = 'Please select Lost or Found';
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.contactName.trim()) e.contactName = 'Your name is required';
    if (!form.contactEmail.trim()) e.contactEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.contactEmail)) e.contactEmail = 'Invalid email';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: null }));
  };

  const handleImageSelect = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('image', image);

      const res = await createItem(formData);
      toast.success('🎉 Item reported successfully!');
      navigate(`/items/${res.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <div className="post-form-wrap container">
        <div className="glass-card post-form-card animate-in">
          <h1 className="post-form-title">Report an Item</h1>
          <p className="post-form-sub">
            Fill in the details below to post a lost or found item on the campus board.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Type Selection */}
            <div className="form-group">
              <label className="form-label">
                Item Type <span className="required">*</span>
              </label>
              <div className="type-choice">
                <button
                  type="button"
                  id="type-lost-btn"
                  className={`type-choice-btn ${form.type === 'lost' ? 'selected-lost' : ''}`}
                  onClick={() => { setForm((f) => ({ ...f, type: 'lost' })); setErrors((e) => ({ ...e, type: null })); }}
                >
                  <span className="icon">❌</span>
                  <span className="label">I Lost Something</span>
                  <span className="sub">Report a missing item</span>
                </button>
                <button
                  type="button"
                  id="type-found-btn"
                  className={`type-choice-btn ${form.type === 'found' ? 'selected-found' : ''}`}
                  onClick={() => { setForm((f) => ({ ...f, type: 'found' })); setErrors((e) => ({ ...e, type: null })); }}
                >
                  <span className="icon">✅</span>
                  <span className="label">I Found Something</span>
                  <span className="sub">Report a found item</span>
                </button>
              </div>
              {errors.type && <span className="form-error">{errors.type}</span>}
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="item-title">
                Item Title <span className="required">*</span>
              </label>
              <input
                id="item-title"
                name="title"
                className="form-input"
                placeholder="e.g. Black iPhone 14 Pro"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="item-description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="item-description"
                name="description"
                className="form-textarea"
                placeholder="Describe the item in detail — color, model, any identifying marks..."
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            {/* Category + Location */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="item-category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="item-category"
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="item-location">
                  Location <span className="required">*</span>
                </label>
                <input
                  id="item-location"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Library, Block B, Canteen"
                  value={form.location}
                  onChange={handleChange}
                />
                {errors.location && <span className="form-error">{errors.location}</span>}
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="item-date">
                {form.type === 'found' ? 'Date Found' : 'Date Lost'} <span className="required">*</span>
              </label>
              <input
                id="item-date"
                name="date"
                type="date"
                className="form-input"
                value={form.date}
                onChange={handleChange}
                max={today}
                style={{ colorScheme: 'dark' }}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Item Photo <span style={{ color: 'var(--text-muted)' }}>(optional, max 5MB)</span></label>

              {imagePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: '12px', border: '1px solid var(--glass-border)', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setImagePreview(null); }}
                    style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff',
                      borderRadius: '50%', width: '28px', height: '28px',
                      cursor: 'pointer', fontSize: '14px',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  id="image-upload-zone"
                  className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                  />
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>📸</div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Drag & drop or click to upload</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>JPEG, PNG, GIF, WebP — max 5MB</div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--glass-border)', margin: '8px 0 24px', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Your Contact Details</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                This will be visible to anyone who submits a claim request for this item.
              </p>
            </div>

            {/* Contact fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="contact-name"
                  name="contactName"
                  className="form-input"
                  placeholder="Your name"
                  value={form.contactName}
                  onChange={handleChange}
                />
                {errors.contactName && <span className="form-error">{errors.contactName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="contact-email"
                  name="contactEmail"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.contactEmail}
                  onChange={handleChange}
                />
                {errors.contactEmail && <span className="form-error">{errors.contactEmail}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-phone">
                Phone Number <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <input
                id="contact-phone"
                name="contactPhone"
                type="tel"
                className="form-input"
                placeholder="+91 XXXXX XXXXX"
                value={form.contactPhone}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                id="submit-item-btn"
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
                disabled={submitting}
              >
                {submitting ? '⏳ Submitting...' : form.type === 'found' ? '✅ Post Found Item' : '📢 Post Lost Item'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p className="footer-text">🏫 CampusFind — Helping students reconnect with their belongings</p>
        </div>
      </footer>
    </div>
  );
}
