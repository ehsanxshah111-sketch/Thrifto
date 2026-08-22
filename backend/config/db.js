const mongoose = require('mongoose');

// Vercel serverless functions can reuse a "warm" instance between requests,
// so we cache the connection instead of reconnecting (and instead of
// process.exit()-ing, which would be fatal in a serverless function).
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  // Fail loudly with a message that says exactly what to do, instead of
  // letting mongoose's generic "got undefined" through - that error alone
  // doesn't tell you WHY it's undefined (missing .env file? wrong filename
  // on Windows? empty value?), which is what actually trips people up.
  if (!process.env.MONGO_URI || typeof process.env.MONGO_URI !== 'string' || !process.env.MONGO_URI.trim()) {
    const message =
      '\n❌ MONGO_URI is missing.\n' +
      '   This means backend/.env either doesn\'t exist, isn\'t named exactly ".env"\n' +
      '   (Windows sometimes saves it as ".env.txt" - run `dir /a` in backend/ to check),\n' +
      '   or MONGO_URI is blank inside it.\n' +
      '   Fix: copy backend/.env.example to backend/.env and fill in a real\n' +
      '   MongoDB connection string, then try again.\n';
    console.error(message);
    if (!process.env.VERCEL) process.exit(1);
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    if (!process.env.VERCEL) {
      // On a traditional long-running host, there's nothing useful the
      // process can do without a DB, so exit and let the process manager
      // restart it.
      process.exit(1);
    }
  }
};

module.exports = connectDB;
