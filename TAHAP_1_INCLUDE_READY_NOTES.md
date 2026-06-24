# TAHAP 1 — KERANGKA INCLUDE

Project: Kalkulator Laundry Versi 002

## Status
Tahap 1 selesai disiapkan.

## File yang disiapkan
1. `Code_TAHAP_1_INCLUDE_READY.gs`
2. `Index_TAHAP_1_INCLUDE_READY.html`

## Perubahan pada Code.gs
- `doGet()` diubah dari `HtmlService.createHtmlOutputFromFile("Index")`
  menjadi `HtmlService.createTemplateFromFile("Index").evaluate()`.
- Fungsi `include(filename)` ditambahkan.
- Fungsi `include(filename)` sudah dilengkapi validasi:
  - nama file tidak boleh kosong,
  - tidak boleh memakai path folder,
  - pemanggilan tidak boleh memakai ekstensi `.html`,
  - error dibuat jelas jika file include belum ada.

## Perubahan pada Index.html
- Tidak memecah CSS, HTML, atau JavaScript.
- Tidak mengubah logic fitur.
- Hanya menambahkan header dokumentasi Tahap 1 di bagian paling atas.
- Header ini menjelaskan pola include yang akan dipakai pada tahap berikutnya.

## File sumber Index
- Index_Harga_Layanan_FULL_FIX_ID_OUTLET_COPY_PASTE.txt

## Cara pakai
1. Buka Apps Script.
2. Buka file `Code.gs`.
3. Ganti seluruh isi `Code.gs` dengan isi file `Code_TAHAP_1_INCLUDE_READY_COPY_PASTE.txt`.
4. Buka file `Index.html`.
5. Ganti seluruh isi `Index.html` dengan isi file `Index_TAHAP_1_INCLUDE_READY_COPY_PASTE.txt`.
6. Simpan.
7. Jalankan web app dan tes semua menu utama.

## Catatan penting
Pada Tahap 1 ini belum ada pemanggilan include aktif di Index.html.
Ini sengaja dilakukan agar tidak muncul error karena file pecahan belum dibuat.

Tahap berikutnya yang aman:
Tahap 2 — Pecah CSS global.
