const app = require('../src/app');
const prisma = require('../src/config/db');

// In Vercel serverless functions, we don't start the server with app.listen().
// We simply export the Express app. Vercel acts as the proxy.
// However, we should still ensure Prisma is connected if not already.

let isDbConnected = false;

const connectDb = async () => {
  if (!isDbConnected) {
    try {
      await prisma.$connect();
      isDbConnected = true;
      console.log('Database connected successfully (serverless proxy)');
    } catch (error) {
      console.error('Failed to connect to database:', error);
    }
  }
};

// Start the connection seamlessly, before processing requests
// Usually prisma connects on first query, but explicit is fine
connectDb();

module.exports = app;
