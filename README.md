# GANYAN PRO AI — TJK At Yarışları & Yapay Zeka Tahmin Platformu

Türkiye Jokey Kulübü (TJK) yarış bültenleri, galop dereceleri, handikap verileri ve **Sistem 1 / Jev yapay zeka karar algoritmaları** ile güçlendirilmiş profesyonel at yarışı tahmin ve kupon kurgu platformu.

---

## 🌟 Öne Çıkan Özellikler

### 1. 🏇 Resmi Yarış Programı & Hipodromlar
- **İstanbul Veliefendi (Gece):** Çim ve Sentetik pist, 7 Koşu, 1. ve 2. Altılı Ganyan programı.
- **Ankara 75. Yıl (Gündüz):** Çim ve Kum pist, 6 Koşu.
- **İzmir Şirinyer (Gece):** Kum pist, 6 Koşu.
- Her hipodrom için hava durumu, pist durumu ve güncel koşu saatleri.

### 2. 🤖 Yapay Zeka Tahmin & Karar Motoru (Ganyan Pro AI)
- **Form Endeksi (0 - 100):** Son 6 koşunun zamana göre katlanarak artan ağırlıklı başarı skoru.
- **Kazanma Olasılığı (%):** Handikap puanı, jokey katsayısı, sıklet avantajı ve galop canlılığının softmax dağılımı.
- **Etiketleme Sistemi:**
  - 👑 **SÜPER BANKO:** Kazanma olasılığı %48'in üzerinde olan ağır favoriler.
  - 🌟 **BANKO:** Ciddi form ve jokey avantajına sahip net birincilik adayları.
  - ⚡ **CİDDİ RAKİP / PLASE:** İkincilik veya birinciliği zorlayacak safkanlar.
  - 💣 **BOMBA / SÜRPRİZ:** Düşük AGF oranına sahip (%10 altı) fakat hafif kilo ve form ivmesiyle yüksek ganyan getirebilecek atlar.

### 3. ⏱️ Koşu İçi Tempo & Taktik Senaryosu
- Her koşu için kaçak atlar, presçiler ve viraj sonrası sprinte kalkacak safkanların taktik haritası.
- Yapay zeka tarafından üretilen koşu içi senaryo açıklaması.

### 4. 🎫 İnteraktif Altılı Ganyan Kupon Editörü
- Ayak bazında tek tıkla safkan ekleme / çıkarma.
- **Anlık Formül Hesaplayıcı:**  
  $$\text{Tutar} = (\text{Ayak}_1 \times \text{Ayak}_2 \times \text{Ayak}_3 \times \text{Ayak}_4 \times \text{Ayak}_5 \times \text{Ayak}_6) \times \text{Birim Fiyat}$$
- **Tek Tıkla AI Hazır Kuponlar:**
  - ⚡ *Ekonomik Kupon* (Bankolu, min bütçe)
  - 🎯 *İdeal Kupon* (Dengeli standart şablon)
  - 💣 *Sürpriz & Geniş Kupon* (Yüksek ikramiye hedefli)
- Kuponu metin formatında tek tıkla panoya kopyalama ve paylaşma.

### 5. 🎮 Canlı 2D Yarış Simülatörü
- Koşuyu 1000m, 600m, 400m ve 200m pencerelerinde canlı izleme.
- Anlık spiker heyecanı ve anlatımı.
- Finiş podyumu ve konfeti kutlaması.

### 6. 💬 Yapay Zeka Yarış Danışmanı (OpenRouter & Jev Entegre)
- Günün koşuları, bankolar, tempo analizleri hakkında soru-cevap yapabilen canlı sohbet asistanı.

---

## 🚀 Hızlı Başlatma

1. Masaüstündeki **`Ganyan Pro Başlat.bat`** dosyasına çift tıklayın.
2. Veya terminalden:
   ```bash
   cd "C:\Users\PC\Desktop\at-yarisi-tahmin"
   npm run dev -- --host --port 5173
   ```
3. Tarayıcınızda açın: **`http://localhost:5173/`**
