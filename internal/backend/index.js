require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const authRt  = require('./routes/auth');
const txRt    = require('./routes/transactions');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRt);
app.use('/api/tx',   txRt);

const PORT = process.env.PORT || 4000;
app.listen(PORT, function() {
  console.log('🚀 Server listening on http://localhost:' + PORT);
});