// Vercel serverless entry point. Every request to /api/* and /uploads/*
// (see vercel.json) is routed to this function, which just hands off to
// the same Express app used for local development.
module.exports = require('../backend/app');
