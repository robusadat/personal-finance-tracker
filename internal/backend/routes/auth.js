const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const sqlite3  = require('sqlite3').verbose();
const db       = new sqlite3.Database(process.env.DB_FILE);
const router   = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email + password required' });
  const hash = await bcrypt.hash(password, 10);
  db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hash],
    function(err) {
      if (err) return res.status(409).json({ error: 'Email already registered' });
      const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET);
      res.json({ token });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  });
});

module.exports = router;