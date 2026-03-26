const express = require('express');
const db = require('../db/connect');

const router = express.Router();

// GET /api/users/me
router.get('/me', (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, email, nickname, avatar_url, gender, age, interests, lat, lng, status FROM users WHERE id = ?'
    ).get(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.interests = JSON.parse(user.interests);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/me
router.put('/me', (req, res) => {
  try {
    const { nickname, gender, age, interests } = req.body;
    const updates = [];
    const values = [];

    if (nickname) { updates.push('nickname = ?'); values.push(nickname); }
    if (gender) { updates.push('gender = ?'); values.push(gender); }
    if (age) { updates.push('age = ?'); values.push(age); }
    if (interests) { updates.push('interests = ?'); values.push(JSON.stringify(interests)); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.userId);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const user = db.prepare(
      'SELECT id, email, nickname, avatar_url, gender, age, interests, lat, lng, status FROM users WHERE id = ?'
    ).get(req.userId);
    user.interests = JSON.parse(user.interests);

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/location
router.post('/location', (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    db.prepare('UPDATE users SET lat = ?, lng = ? WHERE id = ?').run(lat, lng, req.userId);
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;