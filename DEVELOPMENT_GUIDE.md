# DEVELOPMENT_GUIDE.md — Kalkulator Laundry Versi 002

Dokumen ini adalah pedoman utama pengembangan aplikasi **Kalkulator Laundry Versi 002**.

Tujuannya agar aplikasi memiliki struktur yang kuat, alur yang jelas, performa cepat, mudah diperbaiki saat error, dan siap dikembangkan menjadi aplikasi laundry dengan banyak fitur tanpa menimbulkan tabrakan antar file.

---

## 1. Tujuan Utama Arsitektur Aplikasi

Aplikasi wajib dibangun dengan prinsip berikut:

1. Struktur file harus kuat, kokoh, dan mudah dipahami.
2. Setiap fitur harus memiliki alur kerja yang jelas.
3. Perubahan fitur tidak boleh membuat fitur lain ikut rusak.
4. Jika terjadi error, penyebabnya harus mudah dilacak.
5. Tidak boleh ada logic yang tumpang tindih.
6. Performa aplikasi harus sangat cepat.
7. Script lama yang sudah tidak dipakai wajib dibersihkan.
8. Aplikasi harus siap berkembang menjadi banyak fitur.
9. Distribusi ke user harus rapi melalui Google Sheet dan Apps Script.
10. Perintah untuk AI agent di VS Code harus hemat token, jelas, dan langsung ke masalah.

---

## 2. Prinsip Struktur File

Setiap file harus memiliki tanggung jawab yang jelas.

Jangan mencampur banyak fungsi besar dalam satu file jika fungsi tersebut berbeda tujuan.

Contoh pembagian struktur:

```text
/src
  /core
    app-init.js
    app-config.js
    app-router.js

  /modules
    hpp/
      hpp-service.js
      hpp-calculation.js
      hpp-ui.js

    bep/
      bep-service.js
      bep-calculation.js
      bep-ui.js

    capacity/
      capacity-service.js
      capacity-calculation.js
      capacity-ui.js

  /shared
    constants.js
    helpers.js
    validators.js
    formatter.js

  /data
    sheet-reader.js
    sheet-writer.js
    cache-service.js

  /ui
    components.js
    layout.js
    notification.js

  /tests
    hpp.test.js
    bep.test.js
```

Jika aplikasi memakai Google Apps Script, struktur bisa disesuaikan dengan format Apps Script, tetapi prinsip pemisahannya tetap sama.

---

## 3. Aturan Tanggung Jawab File

Gunakan aturan berikut:

### File `core`

Berisi fondasi aplikasi.

Contoh:

- inisialisasi aplikasi,
- konfigurasi global,
- pengaturan route/alur utama,
- penghubung antar modul.

File core tidak boleh berisi hitungan bisnis yang terlalu spesifik.

### File `modules`

Berisi fitur utama aplikasi.

Setiap fitur wajib dipisah berdasarkan modul.

Contoh modul:

- HPP,
- BEP,
- Fixed Cost,
- Kapasitas Produksi,
- ROI,
- Payback Period,
- Laba Rugi,
- Dashboard,
- Simulasi Harga Jual.

Setiap modul sebaiknya memiliki:

1. file perhitungan,
2. file service/alur data,
3. file tampilan/UI.

### File `shared`

Berisi fungsi umum yang dipakai banyak fitur.

Contoh:

- format rupiah,
- format persen,
- validasi angka,
- pembulatan angka,
- helper tanggal,
- helper teks.

Jangan menaruh logic khusus satu fitur di folder shared.

### File `data`

Berisi semua akses data.

Contoh:

- membaca data dari Sheet,
- menulis data ke Sheet,
- caching,
- mapping data,
- validasi struktur data.

File UI tidak boleh langsung membaca Sheet jika bisa lewat layer data/service.

### File `ui`

Berisi komponen tampilan.

Contoh:

- card,
- tabel,
- grafik,
- modal,
- toast notification,
- layout halaman.

File UI tidak boleh menjadi tempat hitungan bisnis utama.

---

## 4. Alur Data Wajib Jelas

Alur ideal:

```text
Input User
↓
Validasi Data
↓
Service Modul
↓
Calculation Engine
↓
Hasil Perhitungan
↓
Formatter
↓
UI Render
```

Dilarang membuat alur seperti ini:

```text
UI langsung baca data
UI langsung hitung semua
UI langsung tulis ke Sheet
UI langsung render ulang semua halaman
```

Alur yang berantakan membuat aplikasi sulit diperbaiki saat error.

---

## 5. Aturan Performa Aplikasi

Target utama: aplikasi harus terasa sangat cepat.

Usahakan interaksi utama berjalan di bawah **1 detik**.

Prinsip performa:

1. Hindari pemanggilan data berulang tanpa kebutuhan.
2. Gunakan cache untuk data yang sering dipakai.
3. Jangan render ulang seluruh halaman jika yang berubah hanya satu bagian.
4. Pisahkan data statis dan data dinamis.
5. Gunakan debounce untuk input yang sering berubah.
6. Hindari loop besar yang tidak perlu.
7. Jangan membaca Google Sheet berkali-kali dalam satu proses jika datanya sama.
8. Simpan hasil perhitungan sementara jika masih relevan.
9. Update hanya komponen yang berubah.
10. Jangan menaruh proses berat di awal loading jika tidak wajib.

---

## 6. Aturan Perubahan dan Perbaikan Fitur

Jika ada perbaikan atau penambahan fitur, wajib mengikuti aturan ini:

1. Sentuh hanya file yang berhubungan langsung dengan masalah.
2. Jangan mengubah banyak file tanpa alasan kuat.
3. Jangan membuat fungsi baru jika fungsi lama masih bisa diperbaiki dengan aman.
4. Jangan membiarkan script lama yang sudah tidak dipakai.
5. Hapus atau rapikan script yang berpotensi menjadi bug.
6. Jangan membuat dua fungsi dengan tujuan sama.
7. Setiap perubahan harus tetap mengikuti alur data utama.
8. Setelah perbaikan, cek apakah fitur lain terdampak.
9. Jika ada fungsi diganti, pastikan pemanggil lama ikut disesuaikan.
10. Jangan membuat patch sementara yang tidak jelas asal-usulnya.

---

## 7. Aturan Anti Script Sampah

Script sampah adalah kode yang:

- sudah tidak dipakai,
- dobel fungsi,
- tidak jelas asalnya,
- dibuat sebagai tambalan sementara,
- tidak mengikuti alur aplikasi,
- membuat fitur saling bertabrakan.

Aturan wajib:

1. Jika script lama diganti, hapus yang lama.
2. Jika fungsi lama masih dipakai, beri nama yang jelas.
3. Jika fungsi deprecated, beri catatan sementara lalu hapus setelah migrasi selesai.
4. Jangan menyimpan banyak versi fungsi dengan nama mirip.
5. Jangan membuat file cadangan di dalam source utama seperti `final`, `fix`, `baru`, `backup`, atau `coba`.

Contoh yang harus dihindari:

```text
hpp-final.js
hpp-fix-baru.js
hpp-fix-banget.js
hpp-coba-2.js
```

Gunakan nama yang rapi:

```text
hpp-calculation.js
hpp-service.js
hpp-ui.js
```

---

## 8. Aplikasi Siap Berkembang Banyak Fitur

Aplikasi ini harus disiapkan untuk bertambah fitur tanpa merusak fondasi.

Setiap fitur baru harus memenuhi syarat:

1. punya folder atau file khusus,
2. tidak mencampur logic dengan fitur lain,
3. punya input dan output yang jelas,
4. memakai helper bersama jika diperlukan,
5. tidak membuat pemanggilan data berulang,
6. tidak membuat UI menjadi berat,
7. mudah dimatikan atau diperbaiki tanpa merusak fitur lain.

Contoh fitur yang mungkin berkembang:

- Kalkulator HPP,
- Kalkulator BEP,
- Fixed Cost,
- Kapasitas Produksi,
- ROI,
- Payback Period,
- Laba Rugi,
- Simulasi Harga Jual,
- Simulasi Mesin,
- Dashboard Owner,
- Multi Outlet,
- Export PDF,
- Template laporan,
- User onboarding.

---

## 9. Sistem Distribusi ke User

Aplikasi ini direncanakan dijual ke user dengan sistem:

1. user mendapat link Google Sheet,
2. user membuat salinan file,
3. file masuk ke akun Gmail masing-masing user,
4. Apps Script ikut tersimpan otomatis di file user,
5. user bisa memakai aplikasi secara mandiri.

Karena itu, aplikasi wajib memperhatikan:

- tidak boleh bergantung pada akun developer untuk proses utama,
- konfigurasi harus mudah disalin,
- data user harus tersimpan di file user sendiri,
- script harus bisa berjalan setelah file disalin,
- instruksi penggunaan harus sederhana,
- jangan memakai hardcode ID file pribadi jika tidak wajib,
- semua pengaturan penting sebaiknya ada di file konfigurasi.

---

## 10. Aturan Konfigurasi

Semua konfigurasi penting harus diletakkan di satu tempat yang jelas.

Contoh isi konfigurasi:

- nama aplikasi,
- versi aplikasi,
- nama sheet,
- nama range,
- mode debug,
- batas maksimal input,
- pengaturan cache,
- pengaturan tampilan,
- pengaturan default.

Jangan menyebar konfigurasi di banyak file tanpa kebutuhan.

---

## 11. Aturan Error Handling

Setiap proses penting wajib memiliki penanganan error yang jelas.

Error harus menjawab:

1. error terjadi di modul apa,
2. fungsi apa yang gagal,
3. input apa yang menyebabkan error,
4. pesan apa yang aman ditampilkan ke user,
5. pesan teknis apa yang boleh dipakai developer.

Contoh format error internal:

```text
[MODULE: HPP]
[FUNCTION: calculateHPP]
[CAUSE: nilai gas kosong]
[ACTION: validasi input sebelum hitung]
```

Untuk user, pesan harus sederhana:

```text
Data gas belum diisi. Silakan lengkapi dulu sebelum menghitung HPP.
```

---

## 12. Aturan Logging

Logging dipakai untuk membantu mencari error.

Namun logging tidak boleh berlebihan.

Gunakan logging untuk:

- proses penting,
- error,
- validasi gagal,
- proses baca/tulis data,
- proses perhitungan utama.

Hindari logging terlalu banyak di proses yang sering berjalan karena bisa memperlambat aplikasi.

---

## 13. Aturan Penamaan

Gunakan nama yang jelas dan konsisten.

Contoh nama fungsi yang baik:

```text
calculateHPP()
calculateBEP()
getFixedCost()
validateHPPInput()
formatRupiah()
renderBEPResult()
```

Contoh nama yang harus dihindari:

```text
hitung()
proses()
data1()
fixBug()
cobaLagi()
fungsiBaru()
```

Nama harus menjelaskan fungsi sebenarnya.

---

## 14. Aturan Untuk AI Agent di VS Code

Setiap perintah ke AI agent di VS Code wajib hemat token, jelas, dan langsung ke masalah.

Format perintah yang disarankan:

```text
Tugas:
Perbaiki [nama masalah].

File target:
[path file]

Batasan:
- Jangan ubah file lain jika tidak diperlukan.
- Jangan buat fungsi baru jika fungsi lama bisa diperbaiki.
- Hapus script lama yang sudah tidak dipakai.
- Pastikan alur tetap sesuai DEVELOPMENT_GUIDE.md.

Kriteria selesai:
- Bug hilang.
- Tidak ada fitur lain yang rusak.
- Tidak ada script sampah.
- Performa tidak lebih lambat.
```

Contoh perintah:

```text
Tugas:
Perbaiki perhitungan BEP harian yang tidak update saat fixed cost berubah.

File target:
src/modules/bep/bep-calculation.js
src/modules/bep/bep-ui.js

Batasan:
Jangan ubah modul HPP dan kapasitas produksi kecuali benar-benar diperlukan.

Kriteria selesai:
BEP bulanan dan BEP harian otomatis berubah setelah fixed cost berubah.
```

---

## 15. Checklist Sebelum Commit

Sebelum commit ke GitHub, pastikan:

- [ ] fitur berjalan sesuai tujuan,
- [ ] tidak ada error di console,
- [ ] tidak ada script sampah,
- [ ] tidak ada fungsi dobel,
- [ ] tidak ada file backup di source utama,
- [ ] perubahan hanya menyentuh file yang perlu,
- [ ] performa tidak menurun,
- [ ] nama fungsi jelas,
- [ ] alur data tetap rapi,
- [ ] dokumentasi diperbarui jika ada perubahan besar.

---

## 16. Checklist Saat Menambah Fitur Baru

Sebelum fitur baru dibuat:

- [ ] tentukan tujuan fitur,
- [ ] tentukan input,
- [ ] tentukan output,
- [ ] tentukan file target,
- [ ] cek apakah helper lama bisa dipakai,
- [ ] cek apakah perlu cache,
- [ ] cek apakah berdampak ke fitur lain,
- [ ] buat alur sederhana,
- [ ] jangan langsung menulis kode sebelum struktur jelas.

---

## 17. Prinsip Keputusan Teknis

Jika ragu, gunakan prinsip ini:

1. Lebih baik struktur rapi daripada cepat jadi tapi sulit dirawat.
2. Lebih baik satu fungsi jelas daripada banyak fungsi mirip.
3. Lebih baik update satu komponen daripada render ulang semuanya.
4. Lebih baik memperbaiki akar masalah daripada menambah tambalan.
5. Lebih baik hapus kode mati daripada menyimpannya sebagai cadangan.
6. Lebih baik alur sederhana daripada terlihat canggih tapi sulit dilacak.
7. Lebih baik hemat pemanggilan data daripada aplikasi terasa berat.

---

## 18. Standar Akhir

Aplikasi dianggap sehat jika:

- alurnya mudah dijelaskan,
- error mudah dilacak,
- fitur mudah ditambah,
- perubahan kecil tidak merusak banyak bagian,
- performa terasa cepat,
- file tidak berantakan,
- tidak ada logic tumpang tindih,
- user mudah memakai aplikasi,
- developer atau AI agent mudah memperbaiki aplikasi.

---

## 19. Catatan Penting

Dokumen ini harus dijadikan rujukan sebelum:

- membuat fitur baru,
- memperbaiki bug,
- mengubah struktur file,
- menghapus fungsi lama,
- mengoptimalkan performa,
- menyiapkan aplikasi untuk user baru.

Setiap perubahan besar wajib tetap mengikuti prinsip dalam dokumen ini.
