# 🎯 Sanal İmleç & Göz Takibi Özellikleri

## 📌 Genel Bakış

Bu proje, WebGazer.js kullanarak göz hareketleri ile web uygulamasını kontrol etme özelliği sunar.

## 🎨 Sanal İmleç Bileşenleri

### 1. Cursor Dot (Merkez Nokta)
- **Renk:** Turuncu (#FF6B00)
- **Boyut:** 12x12px
- **Özellik:** Gözünüzün tam olarak baktığı noktayı gösterir
- **Animasyon:** Sabit (hareket ediyor ama animasyon yok)

### 2. Cursor Ring (Dış Halka)
- **Renk:** Turuncu (#FF6B00)
- **Boyut:** 40x40px
- **Animasyon:** Pulse (sürekli büyüyüp küçülür)
- **Özellik:** İmleç aktivitesini belirtir

### 3. Progress Circle (İlerleme Çemberi)
- **Renk:** Yeşil (#4CAF50)
- **Boyut:** 60x60px
- **Görünürlük:** Sadece tıklanabilir öğeye bakıldığında
- **Animasyon:** 0-100% dolum (1.5 saniyede)

## ⚡ Otomatik Tıklama Sistemi

### Nasıl Çalışır?

```javascript
Kullanıcı bir butona bakar
    ↓
Element algılanır (document.elementFromPoint)
    ↓
Hover başlar (zamanlayıcı başlatılır)
    ↓
1.5 saniye geçer
    ↓
Otomatik tıklama tetiklenir
    ↓
Ripple animasyonu + element.click()
```

### Algılanan Tıklanabilir Öğeler

1. **HTML Etiketleri:**
   - `<button>`
   - `<a>` (linkler)

2. **CSS Class'ları:**
   - `.action-btn` - Hızlı işlem butonları
   - `.btn` - Genel butonlar
   - `.tab-btn` - Tab butonları
   - `.logout-btn` - Çıkış butonu

3. **Attributes:**
   - `type="submit"` - Form submit butonları
   - `onclick` eventi olan herhangi bir öğe

### Görsel Geri Bildirimler

#### 1. Hover Outline
```css
.gaze-hover {
    outline: 3px solid #FF6B00;
    outline-offset: 2px;
}
```
- Bakılan tıklanabilir öğeye turuncu kenarlık eklenir

#### 2. Progress Bar
- İmleçteki yeşil çember dolmaya başlar
- 0-100% arası smooth animasyon
- %100'e ulaştığında tıklama tetiklenir

#### 3. Click Ripple
```javascript
// Tıklama anında turuncu ripple efekti
position: fixed;
width: 20px → 40px (scale)
opacity: 1 → 0
animation: 500ms
```

## 🎮 Kullanıcı Deneyimi

### Dashboard Sayfası

**Kullanım Senaryosu:**
1. Dashboard'a giriş yapılır
2. 1 saniye sonra WebGazer otomatik başlar
3. Sanal imleç belirir (turuncu nokta)
4. Herhangi bir butona bakın:
   - "Para Gönder"
   - "Fatura Öde"
   - "QR Öde"
   - "Kartlarım"
   - "Yatırım"
   - "Ayarlar"
5. 1.5 saniye bakın → Otomatik tıklama!

### Transfer Sayfası

**İki Mod Var:**

#### Mod 1: Sanal İmleç (Form Doldurma)
- Form elemanlarını göz ile kontrol
- Butonları göz ile tıklama
- Normal web navigasyonu

#### Mod 2: Transfer Onaylama
- "Transferi Onayla" butonuna tıklandığında aktif
- Özel onay butonu belirir
- 3 saniye bakma gerektirir
- Daha güvenli onay mekanizması

## 🔧 Teknik Detaylar

### WebGazer Konfigürasyonu

```javascript
webgazer.setRegression('ridge')         // Ridge regression modeli
  .setTracker('TFFacemesh')             // TensorFlow FaceMesh tracker
  .setGazeListener(function(data, clock) {
    // Gaze data: { x, y }
  })
  .applyKalmanFilter(true);             // Smooth tracking
```

### Kalman Filter

- **Amaç:** İmleç hareketini smoothing yapma
- **Etki:** Titreşimsiz, akıcı imleç hareketi
- **Performans:** FPS düşüşü olmadan çalışır

### Performance Optimizations

1. **requestAnimationFrame** kullanımı
2. **CSS transforms** (GPU accelerated)
3. **pointer-events: none** (imleç tıklanamaz)
4. **throttling** yok (gerçek zamanlı)

## 📊 Timing Değerleri

| Özellik | Süre | Açıklama |
|---------|------|----------|
| Click Duration | 1.5s | Otomatik tıklama için gerekli hover süresi |
| Transfer Confirmation | 3.0s | Transfer onayı için gerekli bakış süresi |
| Init Delay | 1.0s | WebGazer başlatma gecikmesi |
| Ripple Animation | 0.5s | Tıklama ripple efekti süresi |
| Cursor Update | ~16ms | 60 FPS imleç güncelleme |

## 🎯 Kullanım Önerileri

### Başarılı Göz Takibi İçin:

1. **Işık Durumu:**
   - Yeterli ışık olmalı
   - Yüzünüz net görünmeli
   - Arka ışık (backlight) olmamalı

2. **Kamera Pozisyonu:**
   - Kamera göz seviyesinde
   - Mesafe: 50-70 cm ideal
   - Yüz kameraya dik

3. **Kalibrasyon:**
   - İlk kullanımda mutlaka kalibre edin
   - Ekranın farklı noktalarına bakın
   - En az 5 nokta kullanın

4. **Kullanım:**
   - Başınızı fazla hareket ettirmeyin
   - Net şekilde bakın
   - Hızlı göz hareketlerinden kaçının

## 🐛 Bilinen Sınırlamalar

1. **Mobil Destek:** Mobilde sınırlı (ön kamera kullanımı zor)
2. **Hassasiyet:** Küçük butonlarda zorluk olabilir
3. **Çoklu Monitör:** Sadece birincil monitörde çalışır
4. **Gözlük:** Işık yansımalarına dikkat
5. **Göz Rengi:** Koyu gözlerde daha iyi çalışır

## 🚀 Gelecek Geliştirmeler

- [ ] Ayarlanabilir tıklama süresi
- [ ] Sesli geri bildirim
- [ ] Göz kırpma ile tıklama
- [ ] Heatmap görselleştirme
- [ ] Scroll kontrolü
- [ ] Zoom in/out kontrolü
- [ ] Fare + göz hibrit mod

## 📝 API Referansı

### toggleGazeClick(enabled)
```javascript
toggleGazeClick(true);   // Göz tıklamasını aktif et
toggleGazeClick(false);  // Göz tıklamasını devre dışı bırak
```

### updateVirtualCursor(x, y)
```javascript
updateVirtualCursor(100, 200);  // İmleci manuel konumlandır
```

### performGazeClick()
```javascript
performGazeClick();  // Manuel göz tıklaması tetikle
```

### resetHover()
```javascript
resetHover();  // Hover durumunu sıfırla
```

## 🔗 İlgili Kaynaklar

- [WebGazer.js Dokümantasyon](https://webgazer.cs.brown.edu/)
- [TensorFlow.js FaceMesh](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection)
- [Kalman Filter Açıklaması](https://en.wikipedia.org/wiki/Kalman_filter)

---

**Son Güncelleme:** 24 Ekim 2025
**Versiyon:** 1.0.0

