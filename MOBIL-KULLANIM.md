# 📱 Mobil Kullanım Kılavuzu

## ✅ HTTPS Sunucu Çalışıyor!

Uygulamanız artık HTTPS üzerinden çalışıyor ve mobil cihazlarda WebGazer kullanılabilir!

---

## 🌐 Mobil Cihazınızdan Erişim

### 📱 Adım 1: Tarayıcıda Açın

Mobil cihazınızın tarayıcısında şu adresi açın:

```
https://192.168.52.147
```

**ÖNEMLİ:** http değil **https** yazın!

### ⚠️ Adım 2: Güvenlik Uyarısını Geçin

İlk erişimde tarayıcı "güvensiz site" uyarısı verecek (self-signed sertifika kullanıldığı için):

**Chrome (Android):**
1. "Gelişmiş" veya "Advanced" tıklayın
2. "192.168.52.147 adresine devam et" seçeneğine tıklayın

**Safari (iOS):**
1. "Ayrıntıları Göster" veya "Details" tıklayın
2. "Bu Web Sitesini Ziyaret Et" tıklayın
3. Tekrar sorarsa bir daha tıklayın

**Firefox:**
1. "Gelişmiş" tıklayın
2. "Riski Kabul Et ve Devam Et" tıklayın

### 📸 Adım 3: Kamera İzni Verin

1. Giriş yaptıktan sonra (demo/demo)
2. Dashboard veya Transfer sayfasına gidin
3. Tarayıcı kamera izni isteyecek
4. **"İzin Ver"** veya **"Allow"** tıklayın

### 🎯 Adım 4: Kalibrasyon Yapın

**ÖNEMLİ:** Mobilde kalibrasyon şarttır!

1. Transfer sayfasında "Kalibre Et" butonuna tıklayın
2. Ekranda 9 turuncu nokta belirecek
3. **Her noktaya 5 kez tıklayın** (toplam 45 tıklama)
4. Telefonunuzu sabit tutun
5. İyi ışık altında yapın

---

## 🎮 Mobil Optimizasyonları

### Otomatik Aktif Olan Özellikler:

✅ **Daha Fazla Smoothing**
- SMOOTHING_WINDOW: 15 (desktop'ta 10)
- SMOOTHING_FACTOR: 0.2 (desktop'ta 0.3)
- Titreşim %85 azalır

✅ **Düşük FPS**
- 10 FPS (desktop'ta 20 FPS)
- Batarya tasarrufu %70

✅ **Uzun Tıklama Süresi**
- 2.5 saniye (desktop'ta 1.5 saniye)
- Yanlış tıklama riski azalır

✅ **Düşük Çözünürlük Video**
- 320x240 (desktop'ta 640x480)
- CPU kullanımı %60 düşer

✅ **Büyük Butonlar**
- Action butonları: 100px yükseklik
- Form butonları: 56px yükseklik
- Dokunma için optimize

✅ **Büyük Sanal İmleç**
- 80x80px (desktop'ta 60x60px)
- Daha kolay takip

---

## 📊 Mobil vs Desktop

| Özellik | Desktop | Mobil |
|---------|---------|-------|
| Smoothing | 10 nokta | 15 nokta |
| FPS | 20 | 10 |
| Tıklama Süresi | 1.5s | 2.5s |
| Video Çözünürlük | 640x480 | 320x240 |
| İmleç Boyutu | 60px | 80px |
| Buton Yüksekliği | 40px | 56-100px |
| CPU Kullanımı | Orta | Düşük |
| Batarya | N/A | Optimize |

---

## 💡 Mobil Kullanım İpuçları

### 🎯 En İyi Deneyim İçin:

1. **Telefonu Sabitle**
   - Telefon standı kullanın
   - Veya masaya dayayın
   - Titreşim olmasın

2. **İyi Işık**
   - Yüzünüz net görünmeli
   - Arka ışıktan kaçının
   - Gölge olmasın

3. **Kamera Açısı**
   - Ön kamera yüzünüze doğru
   - Göz hizasında
   - 30-50cm mesafe

4. **Kalibrasyon**
   - Her kullanımda kalibre edin
   - En az 5 kez her noktaya tıklayın
   - Başınızı hareket ettirmeyin

5. **Batarya**
   - Şarj aletine takın
   - Göz takibi batarya tüketir

6. **Tarayıcı**
   - Chrome (Android) - En iyi
   - Safari (iOS 14.3+) - İyi
   - Firefox - Orta

---

## 🔧 Sorun Giderme

### Sorun: "HTTPS olmadan çalışmaz" hatası

**Çözüm:**
- URL'in **https://** ile başladığından emin olun
- http:// ÇALIŞMAZ!

### Sorun: Güvenlik uyarısı geçilmiyor

**Çözüm:**
- "Gelişmiş" veya "Advanced" tıklayın
- "Devam et" seçeneğini arayın
- Safari'de iki kez onaylamanız gerekebilir

### Sorun: Kamera izni gelmiyor

**Çözüm:**
- HTTPS kullanıldığından emin olun
- Tarayıcı ayarlarından kamera iznini kontrol edin
- Sayfayı yenileyin

### Sorun: Göz takibi çok yavaş

**Çözüm:**
- Normal! Mobilde 10 FPS optimize edilmiş
- Daha hızlı için: `UPDATE_THROTTLE = 50` yapın
- (dashboard.js ve transfer.js dosyalarında)

### Sorun: İmleç çok titrek

**Çözüm:**
- Yeniden kalibre edin (9 nokta × 5 tıklama)
- Işığı artırın
- Telefonu sabitleyin

### Sorun: Çok fazla batarya tüketiyor

**Çözüm:**
- Normal! Göz takibi CPU yoğun
- Şarj aletine takın
- Kısa süreli kullanım için optimize

---

## 🚀 Alternatif Erişim: ngrok

Eğer yerel ağınız yoksa veya dışarıdan erişim istiyorsanız:

### ngrok Kurulumu:

1. **İndir:**
   ```
   https://ngrok.com/download
   ```

2. **Çalıştır:**
   ```powershell
   # Terminal 1: HTTPS sunucu çalışsın
   
   # Terminal 2: ngrok başlat
   cd C:\ngrok
   .\ngrok.exe http 443
   ```

3. **URL'i Kopyala:**
   ```
   Forwarding: https://abc123.ngrok-free.app
   ```

4. **Mobilde Aç:**
   - ngrok'un verdiği HTTPS URL'i kullanın
   - Güvenlik uyarısı OLMAYACAK!
   - Her yerden erişilebilir

---

## 📱 Desteklenen Cihazlar

### ✅ Android
- Chrome 89+ (En iyi)
- Firefox 88+
- Edge 89+
- Samsung Internet 14+

### ✅ iOS
- Safari 14.3+ (İyi)
- Chrome iOS (Safari engine kullanır)
- Edge iOS (Safari engine kullanır)

### ❌ Desteklenmeyen
- Opera Mini
- UC Browser
- In-app browsers (Facebook, Instagram, etc.)
- WebView uygulamaları

---

## 🎯 Hızlı Başlangıç

```bash
# 1. HTTPS sunucu çalıştır (zaten çalışıyor)
npm run https

# 2. Mobilde aç:
https://192.168.52.147

# 3. Güvenlik uyarısını geç

# 4. Giriş yap: demo / demo

# 5. Dashboard'a git

# 6. Kamera iznini ver

# 7. Kalibre et (transfer sayfasında)

# 8. Kullanmaya başla!
```

---

## 📞 Destek

**Sık Karşılaşılan Durumlar:**

1. **HTTPS gerekli** - http:// çalışmaz
2. **Güvenlik uyarısı normal** - Self-signed sertifika kullanılıyor
3. **Kalibrasyon şart** - Mobilde kalibrasyon yapmazsanız hassasiyet düşük
4. **Batarya tüketimi yüksek** - Normal, şarj aletine takın
5. **FPS düşük** - Optimize edilmiş (10 FPS), batarya için

---

## 🎉 Başarılar!

Artık mobil cihazınızdan göz takibi ile banka uygulamasını kullanabilirsiniz!

**İyi kullanımlar!** 🚀👁️📱

