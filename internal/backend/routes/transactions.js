const express   = require('express');
const sqlite3   = require('sqlite3').verbose();
const auth      = require('../middleware/auth');
const db        = new sqlite3.Database(process.env.DB_FILE);
const router    = express.Router();

// create
router.post('/', auth, (req, res) => {
  const { type, category, amount, date, description } = req.body;
  if (!type || !category || !amount || !date)
    return res.status(400).json({ error: 'type, category, amount & date required' });

  const sql =
    'INSERT INTO transactions (user_id, type, category, amount, date, description) ' +
    'VALUES (?,?,?,?,?,?)';
  db.run(
    sql,
    [req.userId, type, category, amount, date, description || ''],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// list
router.get('/', auth, (req, res) => {
  const sql =
    'SELECT id, type, category, amount, date, description ' +
    'FROM transactions WHERE user_id = ? ORDER BY date DESC';
  db.all(sql, [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
