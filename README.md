# 🏦 AlternatifBank Demo - WebGazer.js Entegrasyonlu

Modern, mobil uyumlu dummy banka uygulaması. Para transfer sayfasında WebGazer.js göz takibi teknolojisi ile işlem onaylama özelliği bulunur.

## 🌟 Özellikler

- ✅ Modern ve responsive tasarım (mobil uyumlu)
- ✅ Kullanıcı girişi
- ✅ Dashboard (hesap özeti, hızlı işlemler, son işlemler)
- ✅ Para transfer sayfası
- ✅ **WebGazer.js göz takibi entegrasyonu**
- ✅ **🎯 Sanal İmleç (Virtual Cursor)** - Göz hareketlerini takip eden özel imleç
- ✅ **👁️ Otomatik Tıklama** - Butonlara 1.5 saniye bakarak tıklama
- ✅ **Progress Indicator** - Hover süresi görselleştirmesi
- ✅ **Gaze Hover Efekti** - Bakılan öğelerin highlight edilmesi
- ✅ **Ripple Animasyonu** - Tıklama için görsel geri bildirim
- ✅ Göz takibi ile işlem onaylama
- ✅ Gerçek zamanlı göz hareketi izleme
- ✅ Kalibrasyon sistemi
- ✅ **Kalman Filter** - Daha smooth imleç hareketi

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- Modern web tarayıcı (Chrome, Firefox, Edge önerilir)
- Webcam (göz takibi için)

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Uygulamayı Başlatın

**Normal Mod (Port 80 - Yönetici yetkisi gerektirir):**

Windows PowerShell'i **Yönetici olarak çalıştırın** ve şu komutu girin:

```bash
npm start
```

**Geliştirme Modu (Port 3000 - Yönetici yetkisi gerektirmez):**

```bash
npm run dev
```

Not: Port 80 kullanmak için Windows'ta yönetici yetkisi gerekir. Eğer yetki sorunu yaşarsanız, `server.js` dosyasında `const PORT = process.env.PORT || 80;` satırını `const PORT = process.env.PORT || 3000;` olarak değiştirebilirsiniz.

### 3. Tarayıcıda Açın

- Port 80 için: `http://localhost`
- Port 3000 için: `http://localhost:3000`

**Sanal Makine/Network üzerinden erişim için:**

Sunucunun IP adresini kullanın:
- `http://192.168.x.x:80` (veya kullandığınız port)

## 🎮 Kullanım

### Giriş Yapma

1. Ana sayfada herhangi bir kullanıcı adı ve şifre girin (dummy uygulama)
2. "Giriş Yap" butonuna tıklayın

### Dashboard

- Hesap bakiyelerinizi görüntüleyin
- Hızlı işlemler menüsünden "Para Gönder" butonuna tıklayın
- Son işlemlerinizi görüntüleyin

### Para Transfer

1. Dashboard'dan "Para Gönder" butonuna **1.5 saniye bakarak** tıklayın (veya fare ile)
2. Transfer formunu doldurun:
   - Gönderen hesap seçin
   - Transfer tipi seçin (IBAN/Telefon/Kayıtlı)
   - Alıcı bilgilerini girin
   - Tutar girin
   - Açıklama ekleyin (opsiyonel)
3. "Transferi Onayla" butonuna **1.5 saniye bakarak** tıklayın
4. **WebGazer göz takibi aktif hale gelir**
5. Ekrandaki "Buraya Bakın" butonuna **3 saniye** bakarak transferi onaylayın
6. Transfer başarılı mesajı görüntülenir

### 🎯 Sanal İmleç ile Tıklama

**Dashboard ve Transfer sayfalarında:**
- 🔴 **Turuncu nokta** gözünüzün baktığı yeri gösterir
- ⭕ **Animasyonlu halka** imleç aktivitesini belirtir
- 🟢 **Yeşil progress bar** hover süresini gösterir
- ⚡ **1.5 saniye** bir butona bakarsanız otomatik tıklanır
- 🎨 **Turuncu outline** bakılan tıklanabilir öğeleri vurgular
- 💥 **Ripple efekti** tıklama anında görsel feedback

### Göz Takibi Kalibrasyonu

- Transfer sayfasında üst kısımda "Kalibre Et" butonu görünür
- Bu butona tıklayarak göz takibini kalibre edebilirsiniz
- Ekranda beliren kırmızı noktalara tıklayın veya bekleyin
- Kalibrasyon sonrası göz takibi daha hassas çalışır

## 📁 Proje Yapısı

```
yeniwebs/
│
├── server.js                 # Express sunucu
├── package.json             # Bağımlılıklar ve scriptler
├── README.md               # Bu dosya
│
└── public/                 # Frontend dosyaları
    ├── index.html         # Giriş sayfası
    ├── dashboard.html     # Dashboard sayfası
    ├── transfer.html      # Para transfer sayfası (WebGazer entegreli)
    ├── styles.css         # Tüm stiller (responsive)
    ├── login.js          # Giriş sayfası JS
    ├── dashboard.js      # Dashboard JS
    └── transfer.js       # Transfer sayfası + WebGazer JS
```

## 🔧 Yapılandırma

### Port Değiştirme

`server.js` dosyasında:

```javascript
const PORT = process.env.PORT || 80;
```

Satırını istediğiniz port numarasıyla değiştirebilirsiniz.

### Ortam Değişkeni ile Port Belirleme

```bash
# Windows PowerShell
$env:PORT=8080; npm start

# Linux/Mac
PORT=8080 npm start
```

## 🌐 Sanal Makine Deployment

### Windows Sanal Makine

1. Node.js'i yükleyin
2. Projeyi sanal makineye kopyalayın
3. PowerShell'i Yönetici olarak açın
4. Proje klasörüne gidin: `cd C:\path\to\yeniwebs`
5. Bağımlılıkları yükleyin: `npm install`
6. Güvenlik duvarı kuralı ekleyin:
   ```powershell
   New-NetFirewallRule -DisplayName "AlternatifBank" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
   ```
7. Uygulamayı başlatın: `npm start`

### Linux Sanal Makine

```bash
# Node.js yükleyin
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Projeyi kopyalayın ve klasöre gidin
cd /path/to/yeniwebs

# Bağımlılıkları yükleyin
npm install

# Port 80 için izin verin (opsiyonel)
sudo setcap 'cap_net_bind_service=+ep' $(which node)

# Uygulamayı başlatın
npm start

# Veya PM2 ile sürekli çalıştırın
sudo npm install -g pm2
pm2 start server.js --name alternatifbank
pm2 startup
pm2 save
```

## 🎨 WebGazer.js Özellikleri

### Göz Takibi Nasıl Çalışır?

1. **TFFacemesh** tracker ile yüz tespiti yapılır
2. **Ridge regression** ile göz pozisyonu hesaplanır
3. **Kalman Filter** ile imleç hareketi smoothing yapılır
4. Kullanıcının baktığı nokta gerçek zamanlı olarak izlenir
5. Kalibrasyon ile hassasiyet artırılır

### 🎯 Sanal İmleç Sistemi

**Özellikler:**
- ✨ **Gerçek zamanlı takip** - 60 FPS göz hareketi izleme
- 🎨 **Görsel feedback** - Multi-layer cursor tasarımı
- ⏱️ **Dwell-time tıklama** - 1.5 saniye hover = tıklama
- 📊 **Progress indicator** - Dairesel dolum animasyonu
- 🎭 **Hover highlight** - Turuncu outline efekti
- 💥 **Click animation** - Ripple efekti
- 🎯 **Smart detection** - Tüm tıklanabilir öğeleri algılar

**Algılanan Öğeler:**
- `<button>` etiketleri
- `<a>` linkleri
- `.action-btn`, `.btn`, `.tab-btn` class'lı öğeler
- `onclick` eventi olan öğeler
- `type="submit"` öğeler

### Gaze-Based Onaylama

- Transfer onaylama butonu 120x120px dairesel alan
- Kullanıcı bu alana **3 saniye** baktığında işlem onaylanır
- Progress bar ile görsel geri bildirim
- Göz takibi verisi WebGazer.js tarafından sağlanır

### 🎮 Kullanım Tipleri

1. **Normal Mod** - Hem fare hem göz takibi kullanılır
2. **Göz Takibi Onlama** - Transfer onayı için özel mod
3. **Sanal İmleç** - Dashboard'da hands-free navigasyon

## 🔒 Güvenlik Notu

Bu bir **DEMO/DUMMY** uygulamadır. Gerçek bir bankacılık uygulaması değildir:

- ❌ Gerçek kimlik doğrulaması yok
- ❌ Gerçek veritabanı yok
- ❌ Gerçek para transferi yok
- ❌ Backend güvenlik önlemleri minimal

**Eğitim ve test amaçlı kullanılmalıdır.**

## 🛠️ Sorun Giderme

### Webcam Erişim Hatası

- Tarayıcınızın webcam izinlerini kontrol edin
- HTTPS veya localhost kullandığınızdan emin olun
- Başka bir uygulamanın webcam kullanmadığından emin olun

### Port 80 Erişim Hatası

- PowerShell/Terminal'i Yönetici olarak çalıştırın
- Veya farklı bir port kullanın (3000, 8080, vb.)

### WebGazer Yüklenmiyor

- İnternet bağlantınızı kontrol edin (CDN üzerinden yüklenir)
- Tarayıcı konsolunda hata mesajlarını kontrol edin

## 📝 Lisans

Bu proje eğitim amaçlıdır ve MIT lisansı altındadır.

## 🙏 Teşekkürler

- [WebGazer.js](https://webgazer.cs.brown.edu/) - Göz takibi kütüphanesi
- [Express.js](https://expressjs.com/) - Web framework
- [TensorFlow.js](https://www.tensorflow.org/js) - Makine öğrenimi (WebGazer tarafından kullanılır)

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Geliştirici Notu:** WebGazer.js ilk kullanımda kalibrasyon gerektirir. Daha iyi sonuçlar için:
1. Kameranızı yüzünüzün tam karşısına yerleştirin
2. Yeterli ışık olduğundan emin olun
3. Kalibrasyon sırasında ekrandaki noktalara tam olarak bakın
4. Başınızı fazla hareket ettirmeyin

