# 📸 Cute Studio Photobooth (Aesthetic Self-Photo Studio)

Aplikasi Web Photobooth ala studio foto Korea & Jepang (seperti *Life Four Cuts*, *Photoism*, *Haru Film*) yang berjalan langsung di browser laptop/komputer Anda dengan webcam resolusi tinggi.

🔗 **GitHub Repository**: [https://github.com/atmaakha/photobooth](https://github.com/atmaakha/photobooth)

---

## ✨ Fitur-Fitur Utama

### 1. 🌙 Dark Mode & Light Mode
- Tombol toggle Dark Mode (🌙 / ☀️) di header atas sebelah kiri pilihan kamera.
- Tampilan gelap (*deep navy slate*) yang nyaman untuk mata di ruangan redup, dengan penyimpanan preferensi otomatis di browser (`localStorage`).

### 2. 🪞 Live Camera & Cermin (Mirror Mode)
- Akses langsung ke kamera webcam dengan tampilan real-time berkualitas tinggi.
- Pilihan selector kamera jika laptop memiliki lebih dari satu kamera (misalnya webcam eksternal).
- Tombol toggle mode cermin (🪞) agar posisi berpose terasa natural seperti melihat cermin rias.
- Garis panduan studio (📐 Grid Rule-of-Thirds) untuk membantu membingkai pose terbaik.

### 3. ⏱️ Mode Pemotretan Otomatis (Burst Sequence)
- Tombol **"Mulai Foto Otomatis (4 Pose)"**: Mengambil 4 foto berurutan secara otomatis dengan jeda hitung mundur di setiap foto.
- Pilihan timer fleksibel: **3 Detik, 5 Detik, atau 10 Detik**.
- Dilengkapi animasi **Flash Studio**, suara bip hitung mundur, dan efek suara jepretan kamera mekanik profesional (menggunakan Web Audio API tanpa perlu unduh file audio eksternal).
- Opsi foto satuan (📷 Foto 1x) untuk menambah foto bertahap.
- Fitur hapus/retake foto per slot jika ada pose yang kurang pas.

### 4. 🪄 Filter Estetik Studio & AR Face Tracking
- **Soft Glow ✨**: Efek kulit mulus dan cerah ala studio Korea.
- **Pink Love 💕 (AR Face Tracking)**: Mahkota hati pink melayang dan rona pipi merona (*blush*) yang secara otomatis melacak dan mengikuti gerakan kepala setiap orang di layar (*multi-person tracking*).
- **Telinga Kucing 🐱 (AR Face Tracking)**: Telinga kucing berbulu manis di atas kepala, rona pipi merah muda lembut, kumis kucing lucu, dan pita di leher yang mengikuti posisi kepala secara *real-time*.
- **Warm Film 🎞️**: Nuansa hangat vintage retro 90-an.
- **Classic B&W 🖤**: Hitam putih elegan berkarakter kontras tinggi.
- **Rosy Pastel 🌸**: Rona pink merona yang manis dan lembut.
- **Y2K Dream 🪩**: Efek warna cyber pastel dreamy.
- **Moody Noir 🎬**: Nuansa film sinematik dramatis.
- **Natural**: Tampilan asli kamera tanpa filter warna.

### 5. 🎞️ Koleksi Format Strip & Pilihan Bingkai
- **Strip 4-Cut**: Strip vertikal klasik yang ikonik (4 foto vertikal).
- **Story 9:16 (1080×1920 px HD)**: Rasio 9:16 resolusi tinggi ideal untuk Instagram Story, WhatsApp Status, dan TikTok!
- **Double Strip (2×4)**: Strip ganda berdampingan lengkap dengan garis putus-putus gunting (✂️) untuk berbagi bersama sahabat/pasangan.
- **Grid 2×2**: Tipe photocard aesthetic (4 foto kotak).
- **Grid 6-Cut**: 6 foto pose lengkap.
- **Pilihan Warna Bingkai**:
  - Warna solid: Pure White, Chic Noir, Pastel Rosé, Baby Cloud, Matcha Sage, Sweet Butter, Lavender Mist, Vintage Paper.
  - Gradien Estetik: Sunset Dream, Peach Sunrise 🍑, Aurora Mint 🌿, Cosmic Galaxy 🌌.
  - **Pemilih Gradasi Kustom (🎨 Custom Gradient Picker)**: Lingkaran gradasi di paling kanan untuk membuka pop-up interaktif pemilihan 2 warna gradasi bebas dengan pratinjau langsung!

### 6. 🎀 Kustomisasi, Stiker & Upload Foto / PNG Sendiri
- **Stiker Lucu Bawaan**: Pita 🎀, telinga kelinci 🐰, kucing 🐱, bintang ⭐, glitter ✨, ceri 🍒, kacamata 🕶️, dan badge studio.
- **🖼️ Hias dengan Foto / PNG Sendiri**:
  - Unggah foto, gambar transparan PNG, ilustrasi, atau ornamen dekorasi buatan Anda sendiri.
  - Foto tersimpan di barisan thumbnail bawah untuk ditempel berulang kali dengan mudah.
- **Kontrol Penuh Interaktif**:
  - Geser (drag & drop) stiker/gambar langsung di atas kanvas strip foto.
  - Tombol **+** / **−** untuk memperbesar/memperkecil ukuran.
  - Tombol **↻** untuk memutar rotasi stiker (15°).
  - Tombol **🗑️** untuk menghapus stiker yang dipilih, atau **Bersihkan Semua Stiker**.
- **Kustomisasi Teks**: Ubah judul atas, subjudul kenangan, tanggal otomatis, serta barcode estetik di bagian bawah strip.

### 7. 📥 Ekspor & Cetak Berkualitas Tinggi
- **Unduh HD (PNG)**: Diekspor pada resolusi tinggi (~300 DPI) jernih dan tajam untuk dicetak fisik atau diunggah ke media sosial.
- **Cetak Langsung (🖨️)**: Format siap cetak ke printer foto atau simpan sebagai file PDF.
- **Salin Gambar (📋)**: Salin langsung ke clipboard untuk ditempel di WhatsApp/Telegram/Discord.
- **Riwayat Sesi**: Foto strip yang sudah dibuat tersimpan di riwayat sesi galeri lokal.

### 8. 🔒 100% Privat & Aman
- Semua pemrosesan kamera, pelacakan wajah MediaPipe, dan perakitan foto strip diproses langsung di dalam browser perangkat Anda (Client-Side). Tidak ada data wajah atau foto yang dikirim ke server luar.

---

## 🚀 Cara Menjalankan

### Cara 1: Menggunakan Script Cepat (Windows)
Cukup klik dua kali file:
```cmd
start.bat
```
Browser default Anda akan otomatis terbuka di `http://localhost:3000`.

### Cara 2: Menggunakan Terminal / Command Prompt
Jalankan salah satu perintah berikut di direktori proyek:
```bash
python server.py
```
atau dengan Node.js:
```bash
npx serve .
```

---

## 💡 Tips Berfoto Seru
1. Posisikan laptop di tempat dengan pencahayaan terang menghadap wajah.
2. Gunakan timer **5 detik** agar Anda punya waktu cukup untuk berganti pose di setiap jepretan.
3. Aktifkan filter **Pink Love 💕** atau **Telinga Kucing 🐱** untuk efek AR interaktif bersama teman.
4. Gunakan fitur **Foto / PNG Sendiri** untuk menempelkan stiker buatan sendiri atau foto mini untuk hasil strip yang lebih personal dan estetik! ✨
