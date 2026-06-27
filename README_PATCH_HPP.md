# Patch Index.html — Bersihkan Struktur Biaya HPP

File ini dibuat untuk membersihkan tampilan Struktur Biaya HPP tanpa merusak backend.

## Isi paket

1. `Index_HPP_Section_Bersih.txt`
   - Blok pengganti untuk section `STRUKTUR BIAYA HPP`.
   - Menghapus render 3 card HPP.
   - Tidak menambahkan donut/chart/KPI.
   - Tetap memanggil `getStrukturBiayaHPP(cabangId)` agar fitur Harga Layanan tetap aman.

2. `apply_hpp_cleanup.js`
   - Script otomatis untuk mengganti blok HPP di `Index.html`.
   - Tidak menimpa file asli.
   - Output: `Index.clean.html`.

## Cara pakai

Letakkan 3 file ini dalam folder project yang sama:

- `Index.html`
- `Index_HPP_Section_Bersih.txt`
- `apply_hpp_cleanup.js`

Lalu jalankan:

```bash
node apply_hpp_cleanup.js
```

Setelah berhasil, akan muncul file:

```text
Index.clean.html
```

Buka `Index.clean.html`, cek hasilnya. Jika sudah aman, ubah namanya menjadi:

```text
Index.html
```

## Bagian yang dibersihkan

Blok mulai dari:

```js
/**
 * =========================================================================
 * STRUKTUR BIAYA HPP
```

Sampai sebelum:

```js
/* =======================================================================
 * BIAYA TETAP OUTLET (FIXED COST)
```

## Catatan profesional

Backend HPP tidak dihapus karena masih dipakai oleh fitur Harga Layanan untuk membaca HPP dan menghitung margin.
