// Run once with: npm run seed
// Creates the first admin account from the ADMIN_* values in your .env
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@thrifto.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  await User.create({
    name: process.env.ADMIN_NAME || 'Thrifto Admin',
    email,
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    role: 'admin',
  });

  console.log(`Admin account created: ${email}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
