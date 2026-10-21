const express = require('express');
const router = express.Router();
const { Items } = require('../db/jsonStore');
const upload = require('../middleware/upload');

// GET /api/items/stats
router.get('/stats', (req, res) => {
  try {
    res.json(Items.stats());
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/items
router.get('/', (req, res) => {
  try {
    const { type, category, status, search, page = 1, limit = 12 } = req.query;

    const all = Items.query({ type, category, status, search });
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / Number(limit)));
    const skip = (Number(page) - 1) * Number(limit);
    const items = all.slice(skip, skip + Number(limit));

    res.json({ items, total, page: Number(page), totalPages });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/items/:id
router.get('/:id', (req, res) => {
  try {
    const item = Items.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/items
router.post('/', upload.single('image'), (req, res) => {
  try {
    const {
      type, title, description, category,
      location, date, contactName, contactEmail, contactPhone,
    } = req.body;

    if (!type || !title || !description || !category || !location || !date || !contactName || !contactEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const item = Items.create({
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      date,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone ? contactPhone.trim() : null,
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Error creating item', error: err.message });
  }
});

// PATCH /api/items/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const item = Items.updateStatus(req.params.id, status);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
