// Run once with: node seed/seedPromotions.js
// Adds a couple of sample homepage promotions so you can see how the
// hero carousel and promo banner look with admin-managed content.
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const Promotion = require('../models/Promotion');

const promotions = [
  {
    title: 'Independence Day Sale',
    eyebrow: '14th August Special',
    description: 'Up to 30% off selected styles, for a limited time only.',
    ctaText: 'Shop the Sale',
    ctaLink: '/shop',
    placement: 'hero',
    active: true,
    order: 0,
    theme: 'emerald',
  },
  {
    title: 'New In: Onyx & Ivory',
    eyebrow: 'New In',
    description: "This season's monochrome silhouettes, built for everyday wear.",
    ctaText: 'Shop New Arrivals',
    ctaLink: '/shop',
    placement: 'hero',
    active: true,
    order: 1,
    theme: 'classic',
  },
  {
    title: 'The Season Sale',
    eyebrow: 'Limited Time',
    description: 'Selected styles, reduced for a limited time. While sizes last.',
    ctaText: 'Shop the Sale',
    ctaLink: '/shop',
    placement: 'banner',
    active: true,
    theme: 'burgundy',
  },
];

const run = async () => {
  await connectDB();
  await Promotion.deleteMany({});
  await Promotion.insertMany(promotions);
  console.log(`Seeded ${promotions.length} sample promotions`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
