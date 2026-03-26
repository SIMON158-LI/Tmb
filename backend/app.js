const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/matches', authMiddleware, matchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TMB Backend is running!' });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
