const https = require('https');
const express = require('express');
const path = require('path');
const selfsigned = require('selfsigned');

const app = express();
const PORT = process.env.PORT || 443;

// Runtime'da self-signed sertifika oluştur
console.log('🔐 SSL sertifikası oluşturuluyor...');
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

const options = {
  key: pems.private,
  cert: pems.cert
};

console.log('✅ SSL sertifikası oluşturuldu!');

// Static files
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

app.get('/ssl-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ssl-test.html'));
});

// HTTPS sunucu başlat
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🔒 ══════════════════════════════════════════════════════════');
  console.log(`🏦 HTTPS Sunucu ${PORT} portunda çalışıyor`);
  console.log('📱 ══════════════════════════════════════════════════════════');
  console.log('');
  console.log('  📱 Mobil cihazınızdan:');
  console.log(`     https://192.168.52.147`);
  console.log('');
  console.log('  💻 Bilgisayarınızdan:');
  console.log(`     https://localhost`);
  console.log('');
  console.log('⚠️  İLK ERİŞİMDE:');
  console.log('   Tarayıcı "güvensiz site" uyarısı verecek');
  console.log('   Chrome: "Gelişmiş" → "Yine de devam et"');
  console.log('   Safari: "Devam Et" veya "Siteyi Ziyaret Et"');
  console.log('');
  console.log('🔒 ══════════════════════════════════════════════════════════');
});

