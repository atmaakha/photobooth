# 📸 Cute Studio Photobooth (Aesthetic Self-Photo Studio)

Aplikasi Web Photobooth ala studio foto Korea/Jepang (seperti *Life Four Cuts*, *Photoism*, *Haru Film*) yang berjalan langsung di browser laptop menggunakan webcam/kamera laptop Anda.

---

## ✨ Fitur-Fitur Utama

1. **Live Camera & Cermin (Mirror Mode)**
   - Akses langsung ke kamera laptop dengan tampilan real-time berkualitas tinggi.
   - Tombol toggle mode cermin (🪞) agar posisi berpose terasa natural seperti melihat cermin rias.
   - Garis panduan studio (📐 Grid Rule-of-Thirds) untuk membantu membingkai pose terbaik.

2. **Mode Pemotretan Otomatis (Burst Sequence)**
   - Tombol **"Mulai Foto Otomatis (4 Pose)"**: Mengambil 4 foto berurutan secara otomatis dengan hitung mundur di setiap foto.
   - Pilihan timer: **3 Detik, 5 Detik, atau 10 Detik**.
   - Dilengkapi animasi **Flash Studio**, suara bip hitung mundur, dan efek suara jepretan kamera mekanik profesional (menggunakan Web Audio API tanpa perlu unduh file audio eksternal).
   - Opsi foto satuan (📷 Foto 1x) untuk menambah foto bertahap.
   - Fitur hapus/retake foto per slot jika ada pose yang kurang pas.

3. **Filter Estetik Studio**
   - **Soft Glow ✨**: Efek kulit mulus dan cerah ala studio Korea.
   - **Pink Love 💕 (AR Face Tracking)**: Efek cinta pink estetik dengan mahkota hati pink dan rona pipi merona (*blush*) yang secara otomatis melacak dan mengikuti gerakan kepala setiap orang di layar (multi-person tracking) dengan transparansi lembut (*soft opacity*).
   - **Warm Film 🎞️**: Nuansa hangat vintage retro 90-an.
   - **Classic B&W 🖤**: Hitam putih elegan berkarakter.
   - **Rosy Pastel 🌸**: Rona pink merona yang manis.
   - **Y2K Dream 🪩**: Efek warna cyber pastel dreamy.
   - **Moody Noir 🎬**: Nuansa film sinematik dramatis.
   - **Natural**: Tampilan asli kamera tanpa filter.

4. **Koleksi Format Strip & Bingkai (Frames)**
   - **Strip 4-Cut**: Strip vertikal klasik yang ikonik (4 foto).
   - **Story 9:16 (1080x1920 px)**: Rasio 9:16 resolusi tinggi 1080x1920 px dengan 4 foto, ideal untuk Instagram Story, WhatsApp Status, dan TikTok!
   - **Double Strip (2x4)**: Strip ganda berdampingan lengkap dengan garis putus-putus gunting (✂️) untuk berbagi bersama sahabat/pasangan.
   - **Grid 2x2**: Tipe photocard aesthetic (4 foto).
   - **Grid 6-Cut**: 6 foto pose lengkap.
   - Pilihan warna bingkai: Pure White, Chic Noir, Pastel Rosé, Baby Cloud, Matcha Sage, Sweet Butter, Lavender Mist, Vintage Paper, serta 4 pilihan Gradien Estetik (Sunset Dream, Peach Sunrise 🍑, Aurora Mint 🌿, Cosmic Galaxy 🌌)!

5. **Kustomisasi & Stiker Interaktif**
   - Hias foto strip Anda dengan stiker lucu (pita 🎀, telinga kelinci 🐰, kucing 🐱, bintang ⭐, glitter ✨, ceri 🍒, kacamata 🕶️, dan badge lucu).
   - **Geser langsung stiker di atas foto strip** menggunakan mouse/touchpad untuk mengatur posisinya!
   - Atur ukuran stiker (+ / -), rotasi (↻), atau hapus stiker yang dipilih.
   - Sesuaikan teks judul atas, subjudul kenangan, tanggal otomatis, serta efek barcode studio estetik.

6. **Ekspor & Cetak Berkualitas Tinggi**
   - **Unduh HD (PNG)**: Diekspor pada resolusi tinggi (3x rendering ~300 DPI) sehingga sangat jernih untuk dicetak fisik atau diunggah ke Instagram Story / TikTok.
   - **Cetak / Print Langsung (🖨️)**: Siap cetak langsung ke printer foto atau simpan sebagai PDF.
   - **Salin Gambar (📋)**: Salin langsung ke clipboard untuk ditempel di chat.
   - **Riwayat Sesi Hari Ini**: Foto strip yang sudah diambil tersimpan rapi di galeri lokal browser.

7. **100% Privat & Aman**
   - Semua proses kamera dan rendering foto berlangsung di dalam browser laptop Anda sendiri. Tidak ada foto yang dikirim ke server luar.

---

## 🚀 Cara Menjalankan

### Cara 1: Menggunakan Script Cepat (Rekomendasi)
Cukup klik dua kali file:
```
start.bat
```
Browser default Anda akan otomatis terbuka di `http://localhost:3000`.

### Cara 2: Menggunakan Terminal / Command Prompt
Jalankan perintah berikut di folder ini:
```bash
python server.py
```
atau jika ingin menggunakan Node.js:
```bash
npx serve .
```

---

## 💡 Tips Berfoto Seru di Laptop
1. Posisikan laptop di tempat dengan pencahayaan ruangan yang terang menghadap wajah.
2. Gunakan timer **5 detik** agar Anda punya waktu cukup untuk mengganti ekspresi dan pose di setiap jepretan.
3. Setelah selesai berfoto, coba berbagai warna bingkai dan tambahkan stiker lucu sebelum mengunduh hasil fotomu! ✨
