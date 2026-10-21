import React, { useState } from 'react';
import { submitRequest } from '../services/api';
import toast from 'react-hot-toast';

export default function ClaimModal({ item, onClose }) {
  const [form, setForm] = useState({
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.requesterName.trim()) e.requesterName = 'Name is required';
    if (!form.requesterEmail.trim()) e.requesterEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.requesterEmail)) e.requesterEmail = 'Invalid email';
    if (!form.message.trim()) e.message = 'Please describe your claim';
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((err) => ({ ...err, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await submitRequest({ ...form, itemId: item._id });
      toast.success('Request submitted successfully! The poster will contact you.');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isLost = item.type === 'lost';

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isLost ? '🙋 I Found This!' : '📦 I Want to Collect This'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          {isLost
            ? `You think you found "${item.title}"? Fill in your details and a message. The person who lost it will contact you.`
            : `Interested in collecting "${item.title}"? Fill in your details so the finder can reach you.`}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="claim-name">
                Your Name <span className="required">*</span>
              </label>
              <input
                id="claim-name"
                name="requesterName"
                className="form-input"
                placeholder="Full name"
                value={form.requesterName}
                onChange={handleChange}
              />
              {errors.requesterName && <span className="form-error">{errors.requesterName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="claim-email">
                Email <span className="required">*</span>
              </label>
              <input
                id="claim-email"
                name="requesterEmail"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={form.requesterEmail}
                onChange={handleChange}
              />
              {errors.requesterEmail && <span className="form-error">{errors.requesterEmail}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="claim-phone">
              Phone Number <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input
              id="claim-phone"
              name="requesterPhone"
              type="tel"
              className="form-input"
              placeholder="+91 XXXXX XXXXX"
              value={form.requesterPhone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="claim-message">
              {isLost ? 'How did you find it? Any identifying details?' : 'Why do you think this belongs to you?'}
              <span className="required"> *</span>
            </label>
            <textarea
              id="claim-message"
              name="message"
              className="form-textarea"
              placeholder={
                isLost
                  ? 'Describe where you found it, any unique features...'
                  : 'Describe any identifying features, when/where you lost it...'
              }
              rows={4}
              value={form.message}
              onChange={handleChange}
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting} id="claim-submit-btn">
              {submitting ? 'Submitting...' : isLost ? '✅ Submit as Found' : '📦 Request Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
