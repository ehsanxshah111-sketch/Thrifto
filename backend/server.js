// Local / traditional-host entry point (Render, Railway, a VPS, plain
// "node server.js", etc). Vercel does NOT use this file — it uses
// /api/index.js instead, which imports the same app from ./app.
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Thrifto server running on port ${PORT}`));
