const express = require('express');
const router = express.Router();
const { Requests, Items } = require('../db/jsonStore');

// POST /api/requests
router.post('/', (req, res) => {
  try {
    const { itemId, requesterName, requesterEmail, requesterPhone, message } = req.body;

    if (!itemId || !requesterName || !requesterEmail || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const item = Items.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.status === 'resolved') {
      return res.status(400).json({ message: 'This item has already been resolved' });
    }

    const request = Requests.create({
      itemId,
      requesterName: requesterName.trim(),
      requesterEmail: requesterEmail.trim().toLowerCase(),
      requesterPhone: requesterPhone ? requesterPhone.trim() : null,
      message: message.trim(),
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ message: 'Error submitting request', error: err.message });
  }
});

// GET /api/requests/:itemId
router.get('/:itemId', (req, res) => {
  try {
    const requests = Requests.forItem(req.params.itemId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
