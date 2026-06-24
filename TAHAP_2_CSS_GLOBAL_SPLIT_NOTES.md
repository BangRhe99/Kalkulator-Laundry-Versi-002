# TAHAP 2 — PECAH CSS GLOBAL

Project: Kalkulator Laundry Versi 002

## Status
Tahap 2 selesai disiapkan.

## File sumber
- `Index_TAHAP_1_INCLUDE_READY_COPY_PASTE.txt`

## File baru yang dibuat
1. `Style_Tokens.html`
2. `Style_Base.html`
3. `Style_Components.html`

## File yang diperbarui
1. `Index.html` → versi baru: `Index_TAHAP_2_CSS_GLOBAL_SPLIT.html`

## Yang dipindah
### Style_Tokens.html
- Semua variabel `:root`
- Warna, font, radius, dan token global

### Style_Base.html
- Reset global
- `html`, `body`
- `.wrap`
- header aplikasi
- tombol back
- brand
- save status
- screen active/hidden
- list header

### Style_Components.html
- menu utama
- card cabang
- panel
- field/input/select
- button
- pill/tab
- summary
- toast
- confirm modal
- skeleton
- footer
- empty state
- komponen responsive umum

## Yang belum dipindah
CSS fitur masih berada sementara di `Index.html`, yaitu:
1. Master Biaya
2. Struktur Biaya HPP
3. Fixed Cost
4. Harga Layanan

Ini sengaja dilakukan agar Tahap 2 tidak menyentuh fitur dan tetap aman.

## Cara pasang di Apps Script
1. Buat file HTML baru:
   - `Style_Tokens`
   - `Style_Base`
   - `Style_Components`
2. Copy isi masing-masing file `.html` yang saya berikan.
3. Buka `Index.html`.
4. Ganti seluruh isi `Index.html` dengan isi `Index_TAHAP_2_CSS_GLOBAL_SPLIT_COPY_PASTE.txt`.
5. Pastikan `Code.gs` sudah memakai versi Tahap 1 yang memiliki fungsi `include(filename)`.
6. Simpan semua file.
7. Test web app.

## Target test
- Menu utama tampil normal
- Tombol back tampil normal
- Card outlet tampil normal
- Input tetap sama
- Footer tidak rusak

## Catatan penting
Nama file include di Index dipanggil tanpa ekstensi:
```html
<?!= include('Style_Tokens'); ?>
<?!= include('Style_Base'); ?>
<?!= include('Style_Components'); ?>
```

Di Apps Script, nama file HTML-nya cukup:
- `Style_Tokens`
- `Style_Base`
- `Style_Components`
