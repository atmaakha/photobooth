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

## 🚀 Panduan Lengkap Cara Menjalankan

Berikut adalah panduan langkah demi langkah yang sangat mudah diikuti untuk menjalankan aplikasi Photobooth di komputer atau laptop Anda:

### 📋 Prasyarat Sistem
- **Perangkat**: Laptop atau PC yang memiliki kamera (webcam internal atau webcam USB eksternal).
- **Web Browser Modern**: Google Chrome (Sangat Disarankan), Microsoft Edge, Mozilla Firefox, Opera, atau Brave.
- **Koneksi Internet**: Dibutuhkan di awal untuk memuat CDN Tailwind CSS, Google Fonts, dan library pelacak wajah MediaPipe.
- **Python / Node.js** *(Opsional)*: Disarankan untuk menjalankan web server lokal agar semua fitur (seperti AR Face Tracking dan Web Worker) berjalan optimal.

---

### Langkah 1: Unduh / Clone Proyek

Pilih salah satu cara di bawah ini:

* **Cara A (Menggunakan Git):**
  Buka terminal / Git Bash, lalu ketik perintah:
  ```bash
  git clone https://github.com/atmaakha/photobooth.git
  cd photobooth
  ```

* **Cara B (Download File ZIP):**
  1. Kunjungi halaman GitHub: [https://github.com/atmaakha/photobooth](https://github.com/atmaakha/photobooth)
  2. Klik tombol hijau **`<> Code`** di pojok kanan atas.
  3. Pilih **`Download ZIP`**.
  4. Ekstrak file ZIP tersebut ke folder di komputer Anda (misalnya di Desktop atau Documents).

---

### Langkah 2: Menjalankan Aplikasi (Pilih Salah Satu Metode)

Pilih metode yang paling nyaman dan sesuai dengan perangkat Anda:

#### ⚡ Metode A: Klik Dua Kali `start.bat` (Paling Praktis untuk Windows)
1. Buka folder tempat file proyek berada.
2. Cari file bernama **`start.bat`**.
3. **Klik 2x (Double-click)** file `start.bat` tersebut.
4. Jendela terminal hitam akan muncul dan browser default Anda akan otomatis membuka halaman `http://localhost:3000`.

---

#### 🐍 Metode B: Menggunakan Terminal / Command Prompt (Python)
Jika komputer Anda sudah terpasang Python:
1. Buka **Command Prompt (CMD)** atau **PowerShell**.
2. Masuk ke folder proyek photobooth:
   ```cmd
   cd path/ke/folder/photobooth
   ```
3. Jalankan script server bawaan:
   ```bash
   python server.py
   ```
   *(Atau bisa juga menggunakan perintah standar: `python -m http.server 3000`)*
4. Browser akan otomatis terbuka. Jika tidak terbuka otomatis, buka browser Anda lalu ketik alamat:
   👉 **`http://localhost:3000`**

---

#### 🟢 Metode C: Menggunakan Node.js / npx
Jika Anda adalah pengguna Node.js:
1. Buka terminal di folder proyek.
2. Jalankan perintah:
   ```bash
   npx serve .
   ```
3. Buka alamat URL yang tertera di terminal (biasanya `http://localhost:3000` atau `http://localhost:5000`).

---

#### 💻 Metode D: Menggunakan VS Code (Live Server)
1. Buka folder proyek photobooth di aplikasi **Visual Studio Code**.
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey) dari menu Extensions jika belum ada.
3. Klik kanan pada file `index.html`, lalu pilih **"Open with Live Server"**.

---

### Langkah 3: Mengizinkan Akses Kamera di Browser

1. Ketika halaman `http://localhost:3000` pertama kali dibuka di browser, akan muncul kotak dialog izin (pop-up) di pojok kiri atas browser:
   > *"localhost:3000 wants to use your camera"* atau *"Izinkan situs ini menggunakan kamera Anda"*.
2. Klik tombol **`Allow`** / **`Izinkan`**.
3. Tampilan webcam laptop Anda akan langsung aktif di layar studio photobooth! 📸

---

## 🛠️ Solusi Kendala Umum (Troubleshooting)

| Kendala | Penyebab & Solusi |
| :--- | :--- |
| **Layar kamera hitam / tidak muncul gambar** | • Klik ikon **gembok / perizinan** di sebelah kiri URL browser (`http://localhost:3000`), pastikan izin **Kamera (Camera)** sudah disetel ke **Allow / Izinkan**.<br>• Pastikan tidak ada aplikasi lain yang sedang mengunci kamera (tutup aplikasi Zoom, Google Meet, Teams, OBS, Skype, atau aplikasi Kamera Windows).<br>• Jika memiliki webcam ganda, pilih kamera lain melalui dropdown pilihan kamera di pojok kanan atas. |
| **Port 3000 sudah dipakai aplikasi lain** | • Buka file `server.py` dengan teks editor.<br>• Ubah baris ke-7 `PORT = 3000` menjadi port lain, misalnya `PORT = 8080`.<br>• Simpan file dan jalankan kembali `start.bat` atau `python server.py`. |
| **Fitur baru / tombol belum berubah** | • Browser mungkin masih menyimpan file cache lama.<br>• Tekan tombol **`Ctrl + F5`** (atau `Ctrl + Shift + R`) di keyboard untuk melakukan **Hard Refresh** dan memuat versi terbaru. |
| **Cara menghentikan server** | • Di jendela terminal/CMD tempat server berjalan, tekan kombinasi tombol **`Ctrl + C`**, atau cukup tutup jendela terminal tersebut. |

---

## 💡 Tips Berfoto Seru
1. Posisikan laptop di tempat dengan pencahayaan terang menghadap wajah.
2. Gunakan timer **5 detik** agar Anda punya waktu cukup untuk berganti pose di setiap jepretan.
3. Aktifkan filter **Pink Love 💕** atau **Telinga Kucing 🐱** untuk efek AR interaktif bersama teman.
4. Gunakan fitur **Foto / PNG Sendiri** untuk menempelkan stiker buatan sendiri atau foto mini untuk hasil strip yang lebih personal dan estetik! ✨
