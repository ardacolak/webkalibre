# 🔧 Sorun Giderme Rehberi

## 🚨 Yaygın Sorunlar ve Çözümleri

---

## SORUN 1: "Para Gönder" Butonuna Basıldığında Hiçbir Şey Olmuyor

### Sebep:
JavaScript yükleme sırası sorunu veya tarayıcı hatası

### Çözümler:

#### ✅ Çözüm 1: Sayfayı Yenileyin (CTRL+F5)
```
Windows: CTRL + F5
Mac: CMD + SHIFT + R
Mobil: Tarayıcıyı kapatıp yeniden açın
```

#### ✅ Çözüm 2: Tarayıcı Konsolunu Kontrol Edin
1. **F12** tuşuna basın
2. **Console** sekmesine gidin
3. Kırmızı hatalar var mı kontrol edin
4. Hata mesajını okuyun

**Görmelisiniz:**
```
📱 Mobil mod aktif - Dashboard optimizasyonları
   Smoothing: 15, FPS: 10
```

veya (desktop'ta):
```
(Mobil mesajı olmamalı)
```

#### ✅ Çözüm 3: WebGazer'ı Devre Dışı Bırakıp Deneyin
1. Dashboard'a gidin
2. F12 → Console
3. Şunu yazın:
```javascript
document.querySelector('.action-btn').click()
```
4. Transfer sayfası açılmalı

**Açılıyorsa:** WebGazer'dan kaynaklı sorun  
**Açılmıyorsa:** JavaScript hatası

#### ✅ Çözüm 4: Göz Takibini Geçici Kapatın
Console'da:
```javascript
clickEnabled = false;
```
Sonra butona normal tıklayın (fare ile)

---

## SORUN 2: "Site Güvenli Değil" Uyarısı Geçilmiyor

### Mobilde (iPhone/iPad - Safari):

**Adım 1:**
```
1. "Ayrıntıları Göster" veya "Details" → Tıkla
2. "Bu Web Sitesini Ziyaret Et" → Tıkla
3. BİR DAHA "Bu Web Sitesini Ziyaret Et" → Tıkla (evet, 2 kez!)
```

**Eğer hala olmuyorsa:**
```
1. Safari'yi tamamen kapatın (arka plandaki uygulamalardan silin)
2. Yeniden açın
3. Tekrar deneyin
```

### Mobilde (Android - Chrome):

**Adım 1:**
```
1. "Gelişmiş" veya "Advanced" → Tıkla
2. "192.168.52.147 adresine devam et" → Tıkla
```

**Görünmüyorsa:**
```
1. chrome://flags/#allow-insecure-localhost → Aç
2. Enabled yap
3. Chrome'u yeniden başlat
```

### Bilgisayarda:

**Chrome:**
```
1. "Gelişmiş" → Tıkla
2. "localhost adresine devam et (güvenli değil)" → Tıkla
```

**Firefox:**
```
1. "Gelişmiş" → Tıkla
2. "Riski Kabul Et ve Devam Et" → Tıkla
```

**Edge:**
```
1. "Gelişmiş" → Tıkla  
2. "Devam et" → Tıkla
```

---

## SORUN 3: SSL Test Sayfası ile Kontrol Edin

### Önce Bunu Deneyin:

```
https://192.168.52.147/ssl-test
```

**Bu sayfa size:**
- ✅ HTTPS çalışıyor mu?
- ✅ Kamera erişimi alınabiliyor mu?
- ✅ Hangi cihaz/tarayıcı kullanılıyor?

**HTTPS çalışıyorsa ✅ göreceksiniz**  
**HTTP kullanıyorsanız ❌ göreceksiniz**

---

## SORUN 4: Kamera İzni Gelmiyor

### Kontrol Listesi:

#### ✅ 1. HTTPS Kullanıyor musunuz?
```
URL: https://192.168.52.147 ✅
URL: http://192.168.52.147 ❌
```

#### ✅ 2. Tarayıcı İzinlerini Kontrol Edin

**Chrome (Mobil):**
```
1. chrome://settings/content/camera
2. Site ayarları → 192.168.52.147 → İzin ver
```

**Safari (iOS):**
```
1. Ayarlar → Safari → Kamera
2. "Sor" veya "İzin Ver" seçili olmalı
```

**Chrome (Desktop):**
```
1. Adres çubuğundaki 🔒 ikonuna tıkla
2. "Site ayarları"
3. Kamera → İzin ver
```

#### ✅ 3. Başka Uygulama Kamerayı Kullanıyor mu?

Kapatın:
- Zoom
- Skype
- Discord
- Messenger
- WhatsApp
- Diğer tarayıcı sekmeleri

#### ✅ 4. Kamera Çalışıyor mu Test Edin

```
https://192.168.52.147/ssl-test
→ "📸 Kamera Erişimini Test Et" butonu
```

---

## SORUN 5: Göz Takibi Çalışmıyor

### Debug Adımları:

#### 1. WebGazer Başladı mı?
Console'da olmalı:
```
Initializing WebGazer...
WebGazer started successfully
```

#### 2. Mobil mod aktif mi? (mobilde)
```
📱 Mobil mod aktif - Optimizasyonlar uygulandı
```

#### 3. Video preview görünüyor mu?
- Sağ altta küçük video olmalı (desktop'ta)
- Mobilde görünmeyebilir (optimize edilmiş)

#### 4. Manuel WebGazer Başlatma
Console'da:
```javascript
webgazer.begin()
  .then(() => console.log('✅ WebGazer başladı'))
  .catch(err => console.error('❌ Hata:', err));
```

---

## SORUN 6: İmleç Görünmüyor

### Kontrol:

#### Console'da:
```javascript
document.getElementById('virtualCursor').style.display = 'block';
```

#### CSS Override:
```javascript
const cursor = document.getElementById('virtualCursor');
cursor.style.cssText = 'display: block !important; left: 100px; top: 100px; z-index: 99999;';
```

---

## SORUN 7: Çok Yavaş / Donuyor (Mobilde)

### Performans Modu Aktif Et:

Console'da:
```javascript
// Daha az smoothing
SMOOTHING_WINDOW = 5;

// Daha düşük FPS
UPDATE_THROTTLE = 200; // 5 FPS

// Video'yu kapat
webgazer.showVideoPreview(false);
```

---

## SORUN 8: "192.168.52.147'ye Erişilemiyor"

### Ağ Sorunları:

#### ✅ 1. Aynı WiFi'de misiniz?
```
Bilgisayar WiFi: MyHomeWiFi ✅
Telefon WiFi: MyHomeWiFi ✅
```

Farklı WiFi'ler ÇALIŞMAZ ❌

#### ✅ 2. Güvenlik Duvarı Kapalı mı?

PowerShell (Yönetici):
```powershell
New-NetFirewallRule -DisplayName "HTTPS Bank" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

#### ✅ 3. IP Adresini Kontrol Edin

PowerShell:
```powershell
ipconfig
```

"IPv4 Address" satırını bulun, örnek:
```
192.168.1.100  ← BU IP'yi kullanın!
```

#### ✅ 4. Sunucu Çalışıyor mu?

PowerShell:
```powershell
netstat -ano | findstr :443
```

Görmelisiniz:
```
TCP    0.0.0.0:443    ... LISTENING
```

---

## 🆘 Acil Durum: Hiçbir Şey Çalışmıyor!

### Son Çare Resetleme:

```powershell
# 1. Sunucuyu kapat
Get-Process node | Stop-Process -Force

# 2. Tarayıcı cache'ini temizle
CTRL + SHIFT + DELETE

# 3. node_modules sil ve yeniden kur
Remove-Item -Recurse -Force node_modules
npm install

# 4. Sunucuyu başlat
npm run https

# 5. Tarayıcıda Incognito/Private mode kullan
CTRL + SHIFT + N (Chrome)
CTRL + SHIFT + P (Firefox)
```

---

## 📱 Mobil Özel Sorunlar

### iOS Safari - "Sayfa Yanıt Vermiyor"
```
1. Safari Ayarlar → Gelişmiş → Deneysel Özellikler
2. "WebGL" ve "Media Capture" Aktif
3. Safari'yi yeniden başlat
```

### Android Chrome - "Kamera Çalışmıyor"
```
1. Ayarlar → Uygulamalar → Chrome → İzinler
2. Kamera → İzin Ver
3. Mikrofon → İzin Ver (bazen gerekli)
```

---

## 🔍 Detaylı Log Alma

### Tam Debug Modu:

Console'a yapıştırın:
```javascript
// WebGazer debug
webgazer.showVideoPreview(true);
webgazer.showPredictionPoints(true);

// Gaze listener debug
webgazer.setGazeListener(function(data, time) {
    if (data) {
        console.log(`Gaze: X=${Math.round(data.x)}, Y=${Math.round(data.y)}`);
    }
});

// Her 5 saniyede durum raporu
setInterval(() => {
    console.log('=== STATUS REPORT ===');
    console.log('WebGazer initialized:', webgazerInitialized);
    console.log('Click enabled:', clickEnabled);
    console.log('Hovered element:', hoveredElement);
    console.log('Gaze history length:', gazeHistory.length);
}, 5000);
```

---

## 📞 Hala Sorun mu Var?

1. **SSL Test sayfasını açın:** `https://192.168.52.147/ssl-test`
2. **Ekran görüntüsü alın** (tarayıcı console + sayfa)
3. **Hatayı not edin**
4. **Kullandığınız cihaz/tarayıcıyı belirtin**

---

**Başarılar! 🚀**

