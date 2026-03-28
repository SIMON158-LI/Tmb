const express = require('express');
const db = require('../db/connect');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { match_id, content } = req.body;
    if (!match_id || !content) return res.status(400).json({ error: 'match_id and content required' });
    const result = db.prepare('INSERT INTO messages (match_id, sender_id, content) VALUES (?, ?, ?)').run(match_id, req.userId, content);
    res.json({ id: result.lastInsertRowid, match_id, sender_id: req.userId, content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:matchId', (req, res) => {
  try {
    const msgs = db.prepare('SELECT m.*, u.nickname as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.match_id = ? ORDER BY m.created_at ASC').all(req.params.matchId);
    res.json(msgs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', (req, res) => {
  try {
    const convos = db.prepare("SELECT m.id as match_id, m.activity_type, (SELECT content FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message, (SELECT created_at FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_time FROM matches m JOIN match_participants mp ON mp.match_id = m.id WHERE mp.user_id = ? AND m.status = 'confirmed' ORDER BY last_time DESC").all(req.userId);
    res.json(convos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
