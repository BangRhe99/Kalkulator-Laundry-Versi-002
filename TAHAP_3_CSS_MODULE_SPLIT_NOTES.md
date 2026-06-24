# TAHAP 3 — PECAH CSS PER FITUR

Project: Kalkulator Laundry Versi 002

## Status
Tahap 3 selesai disiapkan.

## File baru yang dibuat
1. `Style_Module_MasterBiaya.html`
2. `Style_Module_HPP.html`
3. `Style_Module_FixedCost.html`
4. `Style_Module_HargaLayanan.html`

## File yang diperbarui
1. `Index.html` → versi baru: `Index_TAHAP_3_CSS_MODULE_SPLIT.html`

## Prinsip pengerjaan
- Tidak mengubah nama class.
- Tidak mengubah warna.
- Tidak mengubah layout.
- Tidak menyentuh HTML screen.
- Tidak menyentuh JavaScript.
- Hanya memindahkan CSS fitur dari Index.html ke file module.

## Include aktif di Index.html
Urutan include style di Index sekarang:
1. Style_Tokens
2. Style_Base
3. Style_Components
4. Style_Module_MasterBiaya
5. Style_Module_HPP
6. Style_Module_FixedCost
7. Style_Module_HargaLayanan

Urutan module mengikuti urutan CSS asli agar tidak mengubah prioritas cascade CSS.

## Catatan penting agar tidak error seperti tahap sebelumnya
- Jangan menulis syntax template Apps Script di dalam komentar.
- Jangan menulis contoh include memakai tanda pembuka template di komentar.
- File yang dibuat di Apps Script harus bertipe HTML.
- Nama file di Apps Script dibuat tanpa ekstensi saat dipanggil dari Index.

## Cara pasang di Apps Script
1. Pastikan Tahap 1 dan Tahap 2 sudah normal.
2. Buat file HTML baru:
   - Style_Module_MasterBiaya
   - Style_Module_HPP
   - Style_Module_FixedCost
   - Style_Module_HargaLayanan
3. Copy isi masing-masing file yang saya berikan.
4. Buka Index.html.
5. Ganti seluruh isi Index.html dengan isi `Index_TAHAP_3_CSS_MODULE_SPLIT_COPY_PASTE.txt`.
6. Simpan semua file.
7. Buka URL /dev dan test fitur.

## Target test
- Master Biaya tetap normal
- Struktur HPP tetap normal
- Harga Layanan tetap normal
- Fixed Cost tetap normal
