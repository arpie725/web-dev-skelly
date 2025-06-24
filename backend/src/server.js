import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors()); // for middleware
app.use(express.json()); // tells the app to expect json
const PORT = process.env.PORT || 1322;

// Routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
