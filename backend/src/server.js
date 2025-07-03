import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(cors()); // for middleware
app.use(express.json()); // tells the app to expect json
const PORT = process.env.PORT || 1322;

// Routes
app.use('/auth', authRoutes);
// send any of the requests below to authMiddleware FIRST
// to verify token BEFORE continuing to endpoint
app.use('/user', authMiddleware, userRoutes);

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
