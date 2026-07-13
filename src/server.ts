import app from './app.js';
import { connectDB } from './config/db.js'; // <-- Make sure it has the curly braces and ends with .js

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas first
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is floating on http://localhost:${PORT}`);
  });
});