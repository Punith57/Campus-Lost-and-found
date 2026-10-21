require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');

const sampleItems = [
  {
    type: 'lost',
    title: 'Black iPhone 14 Pro',
    description:
      'Lost my black iPhone 14 Pro near the main library. Has a dark navy blue case with a small crack on the top-right corner. Screen has a tiny scratch. Very important — please contact if found.',
    category: 'Electronics',
    location: 'Main Library, 2nd Floor',
    date: new Date('2026-10-18'),
    contactName: 'Arjun Sharma',
    contactEmail: 'arjun.sharma@campus.edu',
    contactPhone: '+91 98765 43210',
    status: 'open',
  },
  {
    type: 'found',
    title: 'Blue Denim Jacket',
    description:
      'Found a blue denim jacket on one of the benches near the canteen. Medium size, no name written inside. Has a small "NASA" patch on the left sleeve. Kept it at the campus security desk.',
    category: 'Clothing',
    location: 'Canteen Area, Block C',
    date: new Date('2026-10-17'),
    contactName: 'Priya Nair',
    contactEmail: 'priya.nair@campus.edu',
    contactPhone: '+91 91234 56789',
    status: 'open',
  },
  {
    type: 'lost',
    title: 'College ID Card — Rahul Mehta',
    description:
      'Lost my college ID card somewhere between the hostel and the engineering block. Card belongs to Rahul Mehta, Roll No. CS2023041. Please hand it over to the admin office or contact me directly.',
    category: 'ID & Cards',
    location: 'Engineering Block / Hostel Road',
    date: new Date('2026-10-19'),
    contactName: 'Rahul Mehta',
    contactEmail: 'rahul.mehta@campus.edu',
    contactPhone: '+91 87654 32109',
    status: 'open',
  },
  {
    type: 'found',
    title: 'Set of 3 Keys on a Red Keychain',
    description:
      'Found a set of 3 keys on a red keychain with a small "✈️" charm attached. Found them lying on the floor in the computer lab. If these are yours, please describe the keys and the keychain to claim them.',
    category: 'Keys',
    location: 'Computer Lab, Block A',
    date: new Date('2026-10-16'),
    contactName: 'Sneha Kapoor',
    contactEmail: 'sneha.kapoor@campus.edu',
    status: 'open',
  },
  {
    type: 'lost',
    title: 'Calculus Textbook (Stewart, 8th Edition)',
    description:
      'Lost my Stewart Calculus 8th edition textbook. Has my name written inside the front cover: "Ayesha Siddiqui, MA Dept". Also has multiple sticky notes and highlighter marks inside. Very important for exams!',
    category: 'Books & Stationery',
    location: 'Mathematics Department Corridor',
    date: new Date('2026-10-15'),
    contactName: 'Ayesha Siddiqui',
    contactEmail: 'ayesha.sid@campus.edu',
    contactPhone: '+91 99887 76655',
    status: 'open',
  },
  {
    type: 'found',
    title: 'Brown Leather Wallet',
    description:
      'Found a brown leather wallet near the sports ground. Contains some cash and what looks like a bus pass. No ID cards inside so unable to identify the owner. Please contact me with details to claim.',
    category: 'Bags & Wallets',
    location: 'Sports Ground / Football Field',
    date: new Date('2026-10-14'),
    contactName: 'Kiran Desai',
    contactEmail: 'kiran.desai@campus.edu',
    contactPhone: '+91 70000 12345',
    status: 'open',
  },
  {
    type: 'lost',
    title: 'Sony WH-1000XM5 Headphones',
    description:
      'Left my Sony noise-cancelling headphones (black, over-ear) in the reading room. They were in a black zip pouch. Very expensive, please reach out if found. Has a small sticker of a mountain on the right cup.',
    category: 'Electronics',
    location: 'Central Reading Room',
    date: new Date('2026-10-19'),
    contactName: 'Dev Patel',
    contactEmail: 'dev.patel@campus.edu',
    contactPhone: '+91 81111 22222',
    status: 'open',
  },
  {
    type: 'found',
    title: 'Silver Wristwatch',
    description:
      'Found a silver analog wristwatch on the bench outside the auditorium after the cultural event. The watch brand is "Fastrack". Works fine. Kept with me safely — contact with description to claim.',
    category: 'Jewelry & Accessories',
    location: 'Auditorium, Outside Entrance',
    date: new Date('2026-10-13'),
    contactName: 'Meera Iyer',
    contactEmail: 'meera.iyer@campus.edu',
    status: 'open',
  },
  {
    type: 'lost',
    title: 'Black Laptop Backpack',
    description:
      'Lost a black Wildcraft backpack containing my laptop, charger, and notes. Last seen near the cafeteria. Has a yellow keychain attached to the front zip. Please contact urgently — laptop has important project files.',
    category: 'Bags & Wallets',
    location: 'Cafeteria / Food Court',
    date: new Date('2026-10-20'),
    contactName: 'Nikhil Verma',
    contactEmail: 'nikhil.verma@campus.edu',
    contactPhone: '+91 95555 66677',
    status: 'open',
  },
  {
    type: 'found',
    title: 'Pair of Spectacles',
    description:
      'Found a pair of rectangular-frame spectacles (black rims, blue light filter lenses) on a table in the seminar hall after the afternoon session. Kept safely — do contact if these are yours.',
    category: 'Jewelry & Accessories',
    location: 'Seminar Hall, Block D',
    date: new Date('2026-10-18'),
    contactName: 'Ananya Roy',
    contactEmail: 'ananya.roy@campus.edu',
    contactPhone: '+91 88800 99900',
    status: 'open',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Item.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️  Database already has ${existing} item(s). Skipping seed to avoid duplicates.`);
      console.log('   To force re-seed, drop the items collection first.');
    } else {
      await Item.insertMany(sampleItems);
      console.log(`🌱 Seeded ${sampleItems.length} sample items successfully!`);
    }
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
