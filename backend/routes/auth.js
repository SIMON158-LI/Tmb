const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connect');

const router = express.Router();
const SECRET = 'tmb-secret-key-2026';

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({ error: 'email, password, nickname are required' });
    }

    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (email, password_hash, nickname) VALUES (?, ?, ?)'
    ).run(email, password_hash, nickname);

    const token = jwt.sign({ id: result.lastInsertRowid }, SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: result.lastInsertRowid, email, nickname } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, nickname: user.nickname }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;