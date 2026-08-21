// Run once with: node seed/seedProducts.js
// Populates the store with sample Thrifto shoes using the bundled SVG artwork
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const shoes = [
  {
    name: 'Thrifto Onyx Runner',
    description: 'Lightweight black & white running silhouette with a breathable knit upper.',
    price: 8999,
    compareAtPrice: 11999,
    category: 'Running',
    image: '/images/shoe1.svg',
    sizes: [6, 7, 8, 9, 10, 11],
    stock: 15,
    featured: true,
  },
  {
    name: 'Thrifto Mono Court',
    description: 'Classic low-top court sneaker in monochrome leather.',
    price: 7499,
    category: 'Sneakers',
    image: '/images/shoe2.svg',
    sizes: [6, 7, 8, 9, 10, 11, 12],
    stock: 20,
    featured: true,
  },
  {
    name: 'Thrifto Slate Boot',
    description: 'Premium ankle boot with a rugged charcoal sole.',
    price: 12999,
    compareAtPrice: 15999,
    category: 'Boots',
    image: '/images/shoe3.svg',
    sizes: [7, 8, 9, 10, 11],
    stock: 8,
  },
  {
    name: 'Thrifto Ivory High-Top',
    description: 'High-top silhouette in off-white with a contrast black midsole.',
    price: 9999,
    category: 'Sneakers',
    image: '/images/shoe4.svg',
    sizes: [6, 7, 8, 9, 10],
    stock: 0,
  },
  {
    name: 'Thrifto Carbon Formal',
    description: 'Sleek formal oxford in matte black for a premium finish.',
    price: 13999,
    category: 'Formal',
    image: '/images/shoe5.svg',
    sizes: [7, 8, 9, 10, 11, 12],
    stock: 12,
    featured: true,
  },
  {
    name: 'Thrifto Chalk Sandal',
    description: 'Minimalist strap sandal in chalk white with black trim.',
    price: 5499,
    compareAtPrice: 6999,
    category: 'Sandals',
    image: '/images/shoe6.svg',
    sizes: [6, 7, 8, 9, 10],
    stock: 18,
  },
];

const run = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(shoes.map((s) => ({ ...s, soldOut: s.stock <= 0 })));
  console.log(`Seeded ${shoes.length} Thrifto products`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
