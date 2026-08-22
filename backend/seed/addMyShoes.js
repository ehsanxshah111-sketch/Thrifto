// Run once with: node seed/addMyShoes.js
//
// Adds the 12 shoes from your own photos as real products. Unlike
// seedProducts.js (the sample-data script, which wipes everything first),
// this one is PURELY ADDITIVE - it only inserts a shoe if a product using
// that exact image isn't already in the database, so running it twice (or
// running it after you already have other real products) never deletes or
// duplicates anything.
//
// The name, price, description, category, and sizes below are PLACEHOLDERS
// - I don't know these details for your actual shoes, so edit every one of
// them from Admin > Products after running this once. The images
// themselves are your real photos (frontend/public/images/products/).
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const myShoes = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    name: `Shoe ${n} (edit me)`,
    description: 'Edit this description from Admin > Products.',
    price: 4999,
    category: 'Sneakers',
    image: `/images/products/shoe-${n}.png`,
    sizes: [7, 8, 9, 10, 11],
    stock: 10,
  };
});

const run = async () => {
  await connectDB();

  let added = 0;
  let skipped = 0;

  for (const shoe of myShoes) {
    const exists = await Product.findOne({ image: shoe.image });
    if (exists) {
      skipped += 1;
      continue;
    }
    await Product.create({ ...shoe, soldOut: shoe.stock <= 0 });
    added += 1;
  }

  console.log(`Added ${added} new product(s), skipped ${skipped} already-added one(s).`);
  console.log('Now go to Admin > Products and fill in the real name, price, and description for each.');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
