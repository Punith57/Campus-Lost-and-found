const fs = require('fs');
const path = require('path');

const ITEMS_FILE = path.join(__dirname, '../data/items.json');
const REQUESTS_FILE = path.join(__dirname, '../data/requests.json');

// ── Generic helpers ──────────────────────────────────────────
function readFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Items ────────────────────────────────────────────────────
const Items = {
  all() {
    return readFile(ITEMS_FILE);
  },

  findById(id) {
    return this.all().find((i) => i._id === id) || null;
  },

  query({ type, category, status, search } = {}) {
    let items = this.all();

    if (type && type !== 'all') items = items.filter((i) => i.type === type);
    if (category && category !== 'all') items = items.filter((i) => i.category === category);
    if (status && status !== 'all') items = items.filter((i) => i.status === status);

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
      );
    }

    // newest first
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  create(data) {
    const items = this.all();
    const newItem = {
      _id: generateId(),
      ...data,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    writeFile(ITEMS_FILE, items);
    return newItem;
  },

  updateStatus(id, status) {
    const items = this.all();
    const idx = items.findIndex((i) => i._id === id);
    if (idx === -1) return null;
    items[idx].status = status;
    writeFile(ITEMS_FILE, items);
    return items[idx];
  },

  stats() {
    const items = this.all();
    return {
      totalLost: items.filter((i) => i.type === 'lost').length,
      totalFound: items.filter((i) => i.type === 'found').length,
      totalOpen: items.filter((i) => i.status === 'open').length,
      totalResolved: items.filter((i) => i.status === 'resolved').length,
    };
  },
};

// ── Requests ─────────────────────────────────────────────────
const Requests = {
  all() {
    return readFile(REQUESTS_FILE);
  },

  forItem(itemId) {
    return this.all()
      .filter((r) => r.itemId === itemId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  create(data) {
    const requests = this.all();
    const newReq = {
      _id: generateId(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    requests.unshift(newReq);
    writeFile(REQUESTS_FILE, requests);
    return newReq;
  },
};

module.exports = { Items, Requests };
