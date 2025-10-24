const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/transfer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'transfer.html'));
});

app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'demo-controls.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏦 Banka uygulaması ${PORT} portunda çalışıyor`);
  console.log(`📱 Tarayıcıda açmak için: http://localhost:${PORT}`);
});

