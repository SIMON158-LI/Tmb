const express = require('express');
const db = require('../db/connect');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { activity_type, max_people, distance_km } = req.body;
    if (!activity_type) return res.status(400).json({ error: 'activity_type is required' });
    const result = db.prepare('INSERT INTO matches (creator_id, activity_type, max_people, distance_km) VALUES (?, ?, ?, ?)').run(req.userId, activity_type, max_people || 4, distance_km || 20);
    const matchId = result.lastInsertRowid;
    db.prepare('INSERT INTO match_participants (match_id, user_id, confirmed) VALUES (?, ?, 1)').run(matchId, req.userId);
    res.json(db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', (req, res) => {
  try {
    res.json(db.prepare("SELECT m.*, u.nickname as creator_name, (SELECT COUNT(*) FROM match_participants WHERE match_id = m.id) as current_people FROM matches m JOIN users u ON m.creator_id = u.id WHERE m.status = 'waiting' ORDER BY m.created_at DESC").all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/join', (req, res) => {
  try {
    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    if (match.status !== 'waiting') return res.status(400).json({ error: 'Match is not available' });
    const already = db.prepare('SELECT * FROM match_participants WHERE match_id = ? AND user_id = ?').get(req.params.id, req.userId);
    if (already) return res.status(400).json({ error: 'Already joined' });
    const count = db.prepare('SELECT COUNT(*) as c FROM match_participants WHERE match_id = ?').get(req.params.id).c;
    if (count >= match.max_people) return res.status(400).json({ error: 'Match is full' });
    db.prepare('INSERT INTO match_participants (match_id, user_id) VALUES (?, ?)').run(req.params.id, req.userId);
    res.json({ message: 'Joined successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/confirm', (req, res) => {
  try {
    db.prepare('UPDATE match_participants SET confirmed = 1 WHERE match_id = ? AND user_id = ?').run(req.params.id, req.userId);
    const r = db.prepare('SELECT COUNT(*) as total, SUM(confirmed) as confirmed FROM match_participants WHERE match_id = ?').get(req.params.id);
    if (r.total === r.confirmed && r.total > 1) db.prepare("UPDATE matches SET status = 'confirmed', confirmed_at = datetime('now') WHERE id = ?").run(req.params.id);
    res.json({ message: 'Confirmed', all_confirmed: r.total === r.confirmed });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', (req, res) => {
  try {
    const match = db.prepare('SELECT m.*, u.nickname as creator_name FROM matches m JOIN users u ON m.creator_id = u.id WHERE m.id = ?').get(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    match.participants = db.prepare('SELECT u.id, u.nickname, u.gender, mp.confirmed FROM match_participants mp JOIN users u ON mp.user_id = u.id WHERE mp.match_id = ?').all(req.params.id);
    res.json(match);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
