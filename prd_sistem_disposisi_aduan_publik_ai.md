# Product Requirements Document (PRD)
## Sistem Disposisi Aduan Publik AI (AI-Powered Public Complaint Disposition System)

**Versi:** 1.0.0  
**Status:** Ready for Engineering Review  
**Target Platform:** Web Desktop (Responsive Enterprise App)  
**Pemilik Produk:** Tim Transformasi Digital & Layanan Publik  

---

## 1. Executive Summary & Problem Statement

### 1.1 Latar Belakang
Kanal aduan masyarakat pemerintah daerah/nasional (seperti integrasi SP4N-LAPOR!, CRM, media sosial, dan portal digital) menerima ribuan tiket aduan setiap minggunya. Proses manual peninjauan, klasifikasi dinas/SKPD penanggung jawab, serta penentuan skala prioritas manual membutuhkan waktu 12–48 jam. Hal ini menyebabkan penumpukan antrian tiket (*bottleneck*), inkonsistensi penetapan instansi teknis, dan keterlambatan tanggap darurat.

### 1.2 Pernyataan Masalah
- **Waktu Disposisi Lambat:** Rata-rata penanganan manual butuh 18+ menit hanya untuk membaca dan meneruskan 1 tiket ke SKPD/dinas terkait.
- **Human Error & Miskomunikasi Klasifikasi:** Sering terjadi oper-operan aduan antar instansi karena kategori aduan tumpang tindih (misal: penataan kabel optik vs galian jalan vs lampu jalan).
- **Kurangnya Visibilitas Tren Sentimen:** Pimpinan publik tidak memiliki pandangan real-time tentang anomali lonjakan isu publik secara proaktif.

### 1.3 Nilai Solusi (Value Proposition)
Sistem Disposisi Aduan Publik AI memanfaatkan pemrosesan bahasa alami (NLP & LLM Classifier, e.g. CivicBERT) untuk:
1. Membaca deskripsi tiket warga dan secara instan memprediksi kategori & instansi tujuan dengan akurasi target >94%.
2. Menghitung tingkat urgensi (High / Medium / Low) berdasarkan kata kunci risiko, lokasi, dan analisis sentimen publik.
3. Memberikan rekomendasi disposisi instan kepada Verifikator dengan kemampuan *Single-click Approve* dan *Batch Action*.
4. Memangkas waktu tanggap disposisi dari jam menjadi hitungan menit (<18.4 menit rata-rata siklus).

---

## 2. Tujuan Produk & Matrik Keberhasilan (KPIs)

| Metrik | Baseline (Manual) | Target v1.0 (AI Assistant) | Target v2.0 (Automated) |
|---|---|---|---|
| **Akurasi Disposisi AI** | ~75% konsistensi operator | **≥ 94.0%** | ≥ 97.5% |
| **Rata-rata Waktu Disposisi (SLA)** | 120 - 240 menit | **≤ 20 menit** (Saat ini: 18.4m) | < 5 menit |
| **Tingkat Otomatisasi Persetujuan** | 0% | **65% disetujui tanpa modifikasi** | > 85% Auto-routing |
| **Throughput Tiket / Operator** | 15 tiket/jam | **≥ 45 tiket/jam** | ≥ 100 tiket/jam |
| **Tingkat Tiket Keliru Instansi (Bounce Rate)** | 18% ditolak SKPD | **< 3%** | < 1% |

---

## 3. Persona Pengguna & Peran (User Personas)

### Persona 1: Rian Kusuma (Admin Verifikator Disposisi)
- **Karakter:** Staf operasional pusat pengendali aduan warga di Diskominfo/Biro Tata Pemerintahan.
- **Tugas:** Meninjau antrian aduan masuk, memverifikasi rekomendasi AI, mengoreksi dinas tujuan jika perlu, dan melakukan eskalasi darurat.
- **Kebutuhan Utama:** Antarmuka cepat, minim klik, kejelasan alasan rekomendasi model (*explainable AI / confidence score*), serta fitur persetujuan massal (*batch approval*).

### Persona 2: Kepala Dinas / Pimpinan Eksekutif (Viewer / Decision Maker)
- **Tugas:** Memantau isu publik mingguan, memantau kinerja SLA penanganan, dan merespons lonjakan anomali isu kota.
- **Kebutuhan Utama:** Kartu analitik ringkas, kurva tren sentimen publik, dan indikator performa sistem real-time.

### Persona 3: Administrator Sistem AI / DevOps
- **Tugas:** Menjaga kesehatan model (*CivicBERT/LLM pipeline*), latensi inferensi (<50ms), dan sinkronisasi berkala bobot model (*Sync Model*).

---

## 4. Ruang Lingkup Fungsional (Feature Specifications)

### 4.1 Global Navigation & Header (Persistent Shell)
- **Brand Identity:** Logo resmi, nama portal (*Disposisi AI / SP4N*), identifikasi instansi pemerintah digital.
- **Menu Navigasi Sidebar:**
  - `Dashboard Overview` (Active)
  - `AI Disposition Center` (dengan counter badge tiket belum diverifikasi, misal `12`)
  - `Ticket Management` (arsip riwayat tiket komprehensif)
  - `Analytics & Reporting` (analisis mendalam SLA & sebaran wilayah)
  - `Settings & Model Calibration` (pengaturan parameter confidence threshold)
- **Header Atas:**
  - Global Search dengan dukungan hotkey `⌘K` / `Ctrl+K` untuk pencarian ID Tiket, nama pelapor, atau kata kunci aduan.
  - Indikator Status Mesin AI: Visual real-time status online/offline beserta latensi (`AI Engine Online (42ms)`).
  - Notifikasi tiket berprioritas kritis (<2 jam SLA).
  - Profil verifikator aktif dan opsi switch tema (Dark / Light mode).

### 4.2 KPI Summary Cards Row
1. **Total Aduan Masuk:** Menampilkan akumulasi aduan mingguan (1,482 tiket), perbandingan tren (+14.2% WoW), sparkline harian, dan tiket masuk hari ini (142 tiket).
2. **Akurasi Disposisi AI:** Skor akurasi saat ini (94.8%), status kalibrasi, versi model aktif (`CivicBERT v3.2`).
3. **Rata-rata Waktu Respon:** Waktu respons aktual (18.4 Menit), perbandingan efisiensi (-35%), serta bar perbandingan terhadap batas SLA maksimal (120 Menit).
4. **Menunggu Verifikasi:** Jumlah antrian belum diputuskan (38 Tiket), breakdown tiket berstatus kritis (12 Kritis <2j), dan status antrian.

### 4.3 AI Sentiment & Trend Heatmap (40% Width Panel)
- Menampilkan kluster topik aduan utama hasil ekstraksi NLP:
  - *Infrastruktur Jalan & Jembatan* (+28%, sentimen negatif 78%)
  - *Pelayanan KTP-el & KK* (+11%, sentimen negatif 62%)
  - *Kesehatan - Rujukan BPJS RSUD* (-4%, sentimen negatif 84%)
  - *Lingkungan - Pembuangan Sampah Liar* (+16%, sentimen negatif 55%)
  - *Pendidikan - Verifikasi SPMB* (Stabil, sentimen negatif 45%)
- Visual progress bar perbandingan polaritas keluhan.
- **AI Summary Insight Card:** Ringkasan naratif otomatis (contoh: lonjakan jalan rusak pasca hujan di Gambir & Menteng) untuk saran respon cepat.

### 4.4 Rekomendasi Disposisi AI & Routing Table (60% Width Panel)
- **Filter Tabs:** *Semua (38)*, *Prioritas Tinggi (12)*, *Confidence >95% (24)*, *Eskalasi (2)*.
- **Search & Filter Khusus:** Filter tabel spesifik untuk mempersempit antrian.
- **Kolom Data:**
  - Multi-select Checkbox (untuk batch selection).
  - ID Tiket & Nama Pelapor + Lokasi Kecamatan/Kelurahan.
  - Kategori Terdeteksi AI (*Infrastruktur*, *Kependudukan*, *Fasilitas Umum*, *Lingkungan*, dll).
  - Badge Urgensi (*Tinggi*, *Sedang*, *Rendah* dengan warna semantik terstandar).
  - Confidence Match Score (% akurasi kecocokan rekomendasi, e.g. 98%, 95%).
  - Rekomendasi Instansi Tujuan (misal: *Dinas Bina Marga*, *Dinas Dukcapil*, *Dinas Perhubungan*).
  - Tombol Aksi: Tinjau Detail (*Review*) dan Setujui Langsung (*Approve*).
- **Aksi Massal (*Batch Action Bar*):**
  - Tombol aksi primer `Setujui Terpilih (N)` untuk menyelesaikan tiket berkepercayaan tinggi dalam 1 kali klik.
  - Paginasi data yang bersih.

### 4.5 Banner Panduan Operasional & Otomasi
- Banner konfirmasi ambang batas akurasi (94.8%) dengan opsi aktivasi fitur *Proses Otomatis* untuk tiket dengan skor di atas batas kepercayaan tertentu (>97%).

---

## 5. Non-Functional Requirements (NFR)

1. **Performansi & Kecepatan:**
   - Waktu muat awal halaman dashboard ≤ 1.2 detik (First Contentful Paint).
   - Inferensi klasifikasi rekomendasi tiket ≤ 150ms per permintaan.
2. **Aksesibilitas & Keterbacaan:**
   - Memenuhi standar WCAG 2.1 Level AA (kontras teks minimal 4.5:1 baik pada Dark Mode Obsidian maupun Light Mode).
   - Navigasi keyboard penuh untuk modal dan filter antrian.
3. **Keandalan & Keamanan Data:**
   - Enkripsi data identitas warga (NIK, no. telp) sesuai regulasi Perlindungan Data Pribadi (UU PDP).
   - Audit trail untuk setiap persetujuan dan pengubahan dinas tujuan oleh verifikator.
4. **Desain Sistem & Kompatibilitas:**
   - Menggunakan token desain konsisten (Design System: Civic Precision / Obsidian Sentinel).
   - Kode modular siap diintegrasikan dengan Next.js / React, Tailwind CSS, dan Lucide Icons.

---

## 6. Rencana Rilis & Roadmap

- **Fase 1 (MVP - Saat ini):** Dashboard Verifikator Disposisi, Ringkasan KPI, Visualisasi Sentimen, Tabel Rekomendasi AI dengan fitur Quick/Batch Approval (Tersedia versi Tema Terang dan Gelap).
- **Fase 2:** Integrasi integrasi notifikasi WhatsApp/SMS otomatis ke warga saat tiket berhasil didisposisikan.
- **Fase 3:** Fitur *Auto-Routing Autonomous* untuk tiket dengan skor akurasi di atas 98.5% tanpa memerlukan verifikasi manusia manual.
- **Fase 4:** Analitik prediktif pemetaan sebaran geospasial (GIS Heatmap) berbasis titik koordinat GPS aduan warga.
