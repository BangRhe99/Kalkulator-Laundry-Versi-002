# Peta File Project — Kalkulator Laundry Versi 002

File ini adalah panduan kerja untuk memahami fungsi setiap file, tempat menambah fitur, tempat memperbaiki fitur, dan tempat membersihkan file agar tidak menjadi script sampah.

Project ini memakai **Google Apps Script + HTML Web App**.

- File `.gs` = backend/server-side, berjalan di server Google Apps Script.
- File `.html` = tampilan, CSS, dan JavaScript client-side yang berjalan di browser.
- `Index.html` = pusat tampilan dan JavaScript browser.
- `Code.gs` = pintu masuk Web App.
- `Style_*.html` = CSS/tampilan.
- `Modul_*.gs` = logic backend per fitur.
- `Util_*.gs` = fungsi bantu umum backend.
- `Script_Shared_*.html` = file lama Tahap 5. Setelah rollback shared, file ini tidak dipakai lagi.

---

## 1. Alur Besar Aplikasi

```text
User buka URL /exec
        ↓
Code.gs menjalankan doGet()
        ↓
Index.html dirender oleh Apps Script
        ↓
Index.html memanggil include CSS Style_*.html
        ↓
JavaScript di Index.html berjalan di browser
        ↓
Jika butuh data server:
google.script.run.namaFungsiServer()
        ↓
Fungsi server ada di Modul_*.gs / Util_*.gs
        ↓
Data dibaca/disimpan di Google Sheet
```

Aturan penting:

```js
HtmlService.createTemplateFromFile("Index").evaluate()
```

wajib dipakai jika `Index.html` masih punya kode:

```html
<?!= include('Style_Tokens') ?>
```

Jangan memakai:

```js
HtmlService.createHtmlOutputFromFile("Index")
```

karena kode `<?!= include(...) ?>` akan tampil mentah di browser.

---

## 2. File Utama Project

### `Code.gs`

**Fungsi:** pintu masuk Web App.

Isi penting:

- `doGet(e)`
- `include(filename)`
- konstanta global project

**Ubah file ini jika:**

| Masalah / kebutuhan | Tindakan |
|---|---|
| Include tampil mentah di browser | cek `doGet()` |
| Skeleton loading karena template tidak diproses | pastikan pakai `createTemplateFromFile().evaluate()` |
| Menambah helper include | cek `include(filename)` |
| Mengubah tampilan | jangan di sini |
| Menambah logic fitur | jangan di sini, buat/ubah `Modul_*.gs` |

---

### `Index.html`

**Fungsi:** pusat tampilan dan JavaScript browser.

Isi penting:

- struktur HTML menu dan screen
- tombol dan event klik
- fungsi `showScreen()`
- fungsi render tampilan
- fungsi `google.script.run`
- helper client-side setelah rollback shared

**Ubah file ini jika:**

| Kebutuhan | Lokasi kerja |
|---|---|
| Tambah tombol menu | `Index.html` bagian menu utama |
| Tambah layar fitur | tambah `<section class="screen" id="screenNamaFitur">` |
| Ubah perpindahan layar | `showScreen()` |
| Ubah render data | fungsi render di `Index.html` |
| Tambah panggilan server | `google.script.run.namaFungsiServer()` |
| Ubah validasi browser | fungsi validator client-side di `Index.html` |
| Error `xxx is not defined` di browser | cari fungsi `xxx` di `Index.html` |

Setelah rollback Tahap 5, fungsi berikut harus langsung ada di `Index.html`:

- `escapeHtml`
- `toNumber`
- `round2`
- `pad2`
- `safeArray`
- `safeObject`
- `formatRp`
- `money0`
- `formatNum`
- `formatPercent`
- `showToast`
- `setSaveStatus`
- `handleBackendError`
- `validateNumber`
- `validateId`
- `validateRequired`

Jangan lagi memakai:

```html
<?!= include('Script_Shared_Helper') ?>
<?!= include('Script_Shared_Formatter') ?>
<?!= include('Script_Shared_UI') ?>
<?!= include('Script_Shared_Validator') ?>
```

---

### `appsscript.json`

**Fungsi:** manifest Google Apps Script.

Berisi:

- timezone
- runtime V8
- konfigurasi Web App
- exception logging

**Ubah file ini jika:**

| Kebutuhan | Ubah? |
|---|---:|
| Ubah timezone | Ya |
| Ubah akses Web App | Ya |
| Ubah execute as | Ya |
| Ubah tampilan aplikasi | Tidak |
| Tambah fitur kalkulator | Tidak |

---

### `.clasp.json`

**Fungsi:** menghubungkan folder lokal dengan project Apps Script.

Berisi:

- `scriptId`
- `rootDir`

Jangan diubah kecuali pindah project Apps Script.

---

### `.claspignore`

**Fungsi:** menentukan file mana yang ikut `clasp push`.

Jika isinya dimulai dari:

```txt
**/*
```

maka semua file diabaikan dulu. File yang ingin dipush harus diberi whitelist:

```txt
!NamaFile.gs
!NamaFile.html
!appsscript.json
```

**Ubah file ini jika:**

| Kebutuhan | Wajib ubah `.claspignore`? |
|---|---:|
| Tambah file backend `.gs` baru | Ya |
| Tambah file CSS `.html` baru | Ya |
| Hapus file lama | Ya, hapus whitelist-nya |
| File ada di folder tapi tidak ikut push | Ya |
| Error `namaFungsi is not a function` | cek file backend ikut push atau tidak |

---

## 3. Utility Backend

### `Util_Umum.gs`

**Fungsi:** helper umum backend.

Biasanya berisi:

- konversi angka
- pembulatan
- validasi dasar
- pembuat ID
- error response
- sanitasi string

**Aturan:** jangan masukkan logic khusus fitur ke sini.

Contoh yang tidak boleh masuk ke sini:

- rumus HPP khusus
- rumus Fixed Cost khusus
- rumus Harga Layanan khusus

---

### `Util_Penyimpanan.gs`

**Fungsi:** helper penyimpanan data.

Biasanya berisi:

- baca/tulis data
- akses sheet
- JSON storage
- struktur penyimpanan operasional

Ubah file ini jika cara penyimpanan global berubah.

---

### `Migrasi_Skema.gs`

**Fungsi:** migrasi struktur data lama ke struktur baru.

Biasanya berisi:

- `ensureMigrated_()`
- penyesuaian schema
- update data lama agar sesuai versi baru

Ubah file ini jika menambah field baru yang perlu disiapkan untuk data lama.

---

## 4. Modul Backend Per Fitur

### `Modul_Cabang.gs`

**Fungsi:** backend Cabang & Lokasi.

Berisi logic:

- tambah cabang
- edit cabang
- hapus cabang
- list cabang
- get detail cabang
- data profil outlet
- data mesin cuci/pengering

**Kalau update Cabang:**

| Kebutuhan | File |
|---|---|
| Tambah input form cabang | `Index.html` |
| Ubah tampilan form | `Index.html` + `Style_*.html` |
| Simpan field baru | `Modul_Cabang.gs` |
| Data lama butuh field baru | `Migrasi_Skema.gs` |
| Validasi backend | `Modul_Cabang.gs` |

---

### `Modul_BiayaGas.gs`

**Fungsi:** backend biaya gas.

Berisi logic:

- list biaya gas
- tambah/edit biaya gas
- hapus biaya gas
- hitung biaya gas per load

**Kalau update Gas:**

| Kebutuhan | File |
|---|---|
| Ubah form gas | `Index.html` |
| Ubah rumus gas | `Modul_BiayaGas.gs` |
| Ubah tampilan gas | `Style_Module_MasterBiaya.html` |
| Error simpan gas | cek `Index.html` dan `Modul_BiayaGas.gs` |

---

### `Modul_BiayaListrik.gs`

**Fungsi:** backend biaya listrik.

Berisi logic:

- data listrik per cabang
- daya/watt mesin
- biaya listrik per load
- perhitungan pompa/listrik/mesin

**Kalau update Listrik:**

| Kebutuhan | File |
|---|---|
| Ubah input listrik | `Index.html` |
| Ubah rumus listrik | `Modul_BiayaListrik.gs` |
| Ubah tampilan listrik | `Style_Module_MasterBiaya.html` |

---

### `Modul_BiayaAir.gs`

**Fungsi:** backend biaya air.

Berisi logic:

- biaya air PDAM/sumur
- biaya air per load
- input dan simpan data air per cabang

**Kalau update Air:**

| Kebutuhan | File |
|---|---|
| Ubah form air | `Index.html` |
| Ubah rumus air | `Modul_BiayaAir.gs` |
| Ubah tampilan air | `Style_Module_MasterBiaya.html` |

---

### `Modul_BiayaNotaKasir.gs`

**Fungsi:** backend biaya nota/kasir.

Berisi logic:

- sistem nota/kasir
- biaya aplikasi kasir
- biaya nota thermal
- biaya nota manual NCR
- hitung biaya nota per load/transaksi
- simpan data nota per cabang

**Kalau update Nota/Kasir:**

| Kebutuhan | File |
|---|---|
| Ubah pilihan aplikasi/nota | `Index.html` |
| Ubah rumus biaya nota | `Modul_BiayaNotaKasir.gs` |
| Ubah simpan data nota | `Modul_BiayaNotaKasir.gs` |
| Ubah tampilan | `Style_Module_MasterBiaya.html` |

Jika muncul syntax error saat `clasp push`, langsung cek line yang disebut di file ini.

---

### `Modul_BiayaTetapOutlet.gs`

**Fungsi:** backend Fixed Cost / Biaya Tetap Outlet.

Public function penting:

- `listBiayaTetapOutletSummaries()`
- `getBiayaTetapOutlet(cabangId)`
- `saveBiayaTetapOutlet(cabangId, payload)`
- `deleteBiayaTetapOutlet(cabangId)`

Data yang dikelola:

- sewa outlet
- internet
- perawatan
- gaji
- depresiasi mesin
- operasional lain
- total fixed cost bulanan

**Kalau update Fixed Cost:**

| Kebutuhan | File |
|---|---|
| Ubah daftar outlet Fixed Cost | `Index.html` |
| Ubah form Fixed Cost | `Index.html` |
| Ubah rumus fixed cost | `Modul_BiayaTetapOutlet.gs` |
| Ubah tampilan Fixed Cost | `Style_Module_FixedCost.html` |
| Error `listBiayaTetapOutletSummaries is not a function` | cek file ini ikut push dan ada di `.claspignore` |

Wajib ada di `.claspignore`:

```txt
!Modul_BiayaTetapOutlet.gs
```

---

### `Modul_StrukturBiayaHPP.gs`

**Fungsi:** backend Struktur Biaya HPP.

Berisi logic:

- ambil data biaya gas/listrik/air/nota
- gabungkan komponen biaya
- hitung HPP variabel
- hitung struktur biaya per layanan

**Kalau update HPP:**

| Kebutuhan | File |
|---|---|
| Ubah rumus HPP | `Modul_StrukturBiayaHPP.gs` |
| Ubah tampilan card HPP | `Style_Module_HPP.html` |
| Ubah render HPP | `Index.html` |
| HPP error karena data gas/listrik/air | cek modul biaya terkait |

Wajib ada di `.claspignore`:

```txt
!Modul_StrukturBiayaHPP.gs
```

---

### `Modul_HargaLayanan.gs`

**Fungsi:** backend harga layanan dan margin.

Berisi logic:

- list harga layanan
- get harga layanan
- save harga layanan
- hitung margin
- hubungan harga jual dengan HPP

**Kalau update Harga Layanan:**

| Kebutuhan | File |
|---|---|
| Ubah input harga jual | `Index.html` |
| Ubah rumus margin | `Modul_HargaLayanan.gs` |
| Ubah tampilan Harga Layanan | `Style_Module_HargaLayanan.html` |
| Harga layanan butuh HPP | cek `Modul_StrukturBiayaHPP.gs` |

Wajib ada di `.claspignore`:

```txt
!Modul_HargaLayanan.gs
```

---

## 5. File CSS / Tampilan

### `Style_Tokens.html`

**Fungsi:** token desain global.

Ubah di sini jika ingin mengubah:

- warna utama
- warna brand
- radius global
- shadow global
- spacing global

---

### `Style_Base.html`

**Fungsi:** CSS dasar seluruh aplikasi.

Berisi:

- body
- layout dasar
- font
- wrapper
- header
- responsive global

---

### `Style_Components.html`

**Fungsi:** CSS komponen umum.

Berisi:

- tombol
- input
- card
- panel
- modal
- toast
- pill
- grid
- list row

---

### `Style_Module_MasterBiaya.html`

**Fungsi:** CSS khusus Master Biaya.

Dipakai untuk:

- Gas
- Listrik
- Air
- Admin/Nota Kasir

---

### `Style_Module_HPP.html`

**Fungsi:** CSS khusus HPP.

Dipakai untuk:

- card HPP
- grid HPP
- ringkasan biaya
- detail HPP

---

### `Style_Module_FixedCost.html`

**Fungsi:** CSS khusus Fixed Cost.

Dipakai untuk:

- daftar fixed cost
- form fixed cost
- card depresiasi
- ringkasan fixed cost

---

### `Style_Module_HargaLayanan.html`

**Fungsi:** CSS khusus Harga Layanan.

Dipakai untuk:

- form harga layanan
- card margin
- harga jual
- ringkasan margin

---

## 6. File Screen HTML

File screen yang pernah dibuat:

- `Screen_Menu.html`
- `Screen_Cabang.html`
- `Screen_MasterBiaya.html`
- `Screen_HPP.html`
- `Screen_HargaLayanan.html`
- `Screen_FixedCost.html`

**Catatan penting:**

Jika `Index.html` belum memanggil:

```html
<?!= include('Screen_Menu') ?>
```

maka file `Screen_*.html` tidak aktif.

Sebelum mengedit screen file, cek dulu:

```powershell
Select-String -Path Index.html -Pattern "include\('Screen_"
```

Jika hasil kosong, berarti screen aktif masih langsung tertulis di `Index.html`.

---

## 7. File Shared Lama

File ini berasal dari Tahap 5:

- `Script_Shared_Formatter.html`
- `Script_Shared_Helper.html`
- `Script_Shared_UI.html`
- `Script_Shared_Validator.html`
- `Script_Shared_Fromatter.html` jika ada typo lama

**Status setelah rollback:** tidak dipakai.

Aman dihapus jika hasil command ini kosong:

```powershell
Select-String -Path Index.html -Pattern "include\('Script_Shared_"
```

Jangan lupa hapus juga dari `.claspignore`.

---

## 8. File `.js` Lama / Duplikat

Kadang ada file:

- `Code.js`
- `Modul_BiayaTetapOutlet.js`
- `Modul_StrukturBiayaHPP.js`
- `Modul_HargaLayanan.js`

Untuk project ini, backend aktif sebaiknya memakai `.gs`.

Jika logic hanya ada di `.js`, tetapi `.claspignore` tidak mengizinkan `.js`, maka fungsi server tidak ikut deploy.

Jika muncul error:

```text
namaFungsi is not a function
```

cek:

1. fungsi ada di `.gs` atau hanya `.js`
2. file `.gs` ikut `.claspignore`
3. sudah `clasp push`
4. sudah Deploy New Version

---

## 9. Cara Menambah Fitur Baru

Contoh fitur baru: `Target BEP`.

### Langkah 1 — Buat backend

Buat file:

```text
Modul_TargetBEP.gs
```

Isi public function:

```js
function listTargetBEPSummaries() {}
function getTargetBEP(cabangId) {}
function saveTargetBEP(cabangId, payload) {}
function deleteTargetBEP(cabangId) {}
```

### Langkah 2 — Tambahkan ke `.claspignore`

```txt
!Modul_TargetBEP.gs
```

### Langkah 3 — Tambahkan UI di `Index.html`

Tambahkan:

- tombol menu
- `<section class="screen" id="screenTargetBEP">`
- fungsi buka screen
- fungsi render
- fungsi save/load
- panggilan `google.script.run`

### Langkah 4 — Tambahkan CSS jika fitur besar

Buat:

```text
Style_Module_TargetBEP.html
```

Include di `<head>` `Index.html`:

```html
<?!= include('Style_Module_TargetBEP') ?>
```

Tambahkan ke `.claspignore`:

```txt
!Style_Module_TargetBEP.html
```

### Langkah 5 — Push dan deploy

```powershell
clasp push
```

Lalu:

```text
Deploy > Manage deployments > Edit > Version: New version > Deploy
```

---

## 10. Cara Memperbaiki Fitur

### Jika error saat klik tombol

Contoh:

```text
listBiayaTetapOutletSummaries is not a function
```

Artinya frontend memanggil fungsi server, tapi server tidak punya fungsi itu.

Cek:

```powershell
Select-String -Path *.gs -Pattern "function listBiayaTetapOutletSummaries"
```

Jika tidak ketemu:

- modul belum ada
- file masih `.js`
- file belum dicopy ke `.gs`

Jika ketemu, cek `.claspignore`:

```powershell
Select-String -Path .claspignore -Pattern "Modul_BiayaTetapOutlet"
```

Lalu push dan deploy.

---

### Jika error `xxx is not defined`

Kalau error di browser/client:

```powershell
Select-String -Path Index.html -Pattern "function xxx|var xxx|const xxx|let xxx"
```

Kalau error di server:

```powershell
Select-String -Path *.gs -Pattern "function xxx|var xxx|const xxx|let xxx"
```

---

### Jika syntax error saat `clasp push`

Contoh:

```text
SyntaxError: Unexpected token ')' line: 261 file: Modul_BiayaNotaKasir.gs
```

Cek sekitar line:

```powershell
$i=0; Get-Content Modul_BiayaNotaKasir.gs | ForEach-Object {
  $i++
  if ($i -ge 245 -and $i -le 275) {
    "$i`t$_"
  }
}
```

Jangan cari ke file lain dulu. Ikuti file dan line yang disebut oleh error.

---

### Jika include tampil mentah di browser

Contoh:

```html
<?!= include('Style_Tokens') ?>
```

Cek `Code.gs`:

```powershell
Select-String -Path Code.gs -Pattern "createHtmlOutputFromFile|createTemplateFromFile|function include" -Context 2,6
```

Yang benar:

```js
createTemplateFromFile("Index").evaluate()
```

Yang salah:

```js
createHtmlOutputFromFile("Index")
```

---

## 11. Cara Menghapus Fitur

Contoh ingin menghapus Fixed Cost.

Urutan aman:

1. Hapus tombol/menu di `Index.html`.
2. Hapus section screen Fixed Cost di `Index.html`.
3. Hapus fungsi client-side terkait di `Index.html`.
4. Hapus include CSS `Style_Module_FixedCost` jika tidak dipakai.
5. Hapus file `Style_Module_FixedCost.html`.
6. Hapus backend `Modul_BiayaTetapOutlet.gs`.
7. Hapus whitelist di `.claspignore`:

```txt
!Modul_BiayaTetapOutlet.gs
!Style_Module_FixedCost.html
```

8. `clasp push`.
9. Deploy New Version.

---

## 12. Checklist Sebelum `clasp push`

```powershell
# Cek include shared lama
Select-String -Path Index.html -Pattern "include\('Script_Shared_"

# Cek doGet benar
Select-String -Path Code.gs -Pattern "createHtmlOutputFromFile|createTemplateFromFile|function include" -Context 2,6

# Cek backend penting ada
Get-ChildItem Modul_BiayaTetapOutlet.gs, Modul_StrukturBiayaHPP.gs, Modul_HargaLayanan.gs -ErrorAction SilentlyContinue

# Cek whitelist penting
Select-String -Path .claspignore -Pattern "Modul_BiayaTetapOutlet|Modul_StrukturBiayaHPP|Modul_HargaLayanan|Script_Shared"

# Cek status git
git status
```

---

## 13. Checklist Setelah `clasp push`

1. Pastikan file yang diharapkan muncul di daftar pushed files.
2. Masuk Apps Script.
3. Deploy > Manage deployments.
4. Edit deployment.
5. Pilih Version: New version.
6. Deploy.
7. Buka `/exec`.
8. Test fitur satu per satu:

```text
Menu utama
Cabang & Lokasi
Master Biaya
Gas
Listrik
Air
Admin/Nota
HPP
Fixed Cost
Harga Layanan
```

---

## 14. Peta Cepat: Mau Ubah Apa, Cari di Mana?

| Mau ubah apa? | Cari di file |
|---|---|
| Warna utama aplikasi | `Style_Tokens.html` |
| Layout umum aplikasi | `Style_Base.html` |
| Tombol, input, card umum | `Style_Components.html` |
| Menu utama | `Index.html` |
| Perpindahan layar | `Index.html` |
| Render data ke layar | `Index.html` |
| Panggilan server | `Index.html` |
| Logic cabang | `Modul_Cabang.gs` |
| Logic gas | `Modul_BiayaGas.gs` |
| Logic listrik | `Modul_BiayaListrik.gs` |
| Logic air | `Modul_BiayaAir.gs` |
| Logic nota/kasir | `Modul_BiayaNotaKasir.gs` |
| Logic fixed cost | `Modul_BiayaTetapOutlet.gs` |
| Logic HPP | `Modul_StrukturBiayaHPP.gs` |
| Logic harga layanan | `Modul_HargaLayanan.gs` |
| Helper backend | `Util_Umum.gs` |
| Penyimpanan backend | `Util_Penyimpanan.gs` |
| Migrasi data lama | `Migrasi_Skema.gs` |
| File ikut push atau tidak | `.claspignore` |
| Manifest Apps Script | `appsscript.json` |

---

## 15. Prinsip Anti Script Sampah

1. Jangan punya dua file aktif dengan logic sama.
2. Kalau fitur sudah digabung ke `Index.html`, hapus file pecahannya jika tidak dipakai.
3. Kalau file `.js` sudah dicopy ke `.gs`, pastikan `.gs` yang dianggap aktif.
4. Jangan whitelist file yang tidak dipakai di `.claspignore`.
5. Jangan menulis logic fitur khusus di utility umum.
6. Jangan menaruh JavaScript browser di `Code.gs`.
7. Jangan menaruh logic server di `Index.html`.
8. Setelah hapus file, cek lagi `clasp push`.
9. Setiap fitur besar idealnya punya UI, backend, dan CSS sendiri.
10. Satu perubahan, satu test. Jangan pecah banyak file sekaligus tanpa test.

---

## 16. Catatan Error yang Pernah Terjadi

### Skeleton loading macet

Penyebab:

```js
createHtmlOutputFromFile("Index")
```

Solusi:

```js
createTemplateFromFile("Index").evaluate()
```

### `pad2 is not defined`

Penyebab: fungsi shared tidak masuk ke browser.

Solusi: setelah rollback shared, `pad2()` harus ada langsung di `Index.html`.

### `listBiayaTetapOutletSummaries is not a function`

Penyebab: backend Fixed Cost belum ikut push/deploy.

Solusi:

- pastikan `Modul_BiayaTetapOutlet.gs` ada
- pastikan `.claspignore` whitelist
- `clasp push`
- Deploy New Version

---

## 17. Cara Kerja yang Disarankan Setelah Ini

Jika mau tambah fitur atau pecah file:

1. Backup dulu.
2. Ubah satu bagian kecil.
3. Jalankan checklist terminal.
4. `clasp push`.
5. Deploy New Version.
6. Test di `/exec`.
7. Baru lanjut bagian berikutnya.

Jangan lakukan banyak perubahan besar sekaligus, karena kalau error akan sulit melacak akar masalahnya.

---

**Versi file:** 1.0  
**Project:** Kalkulator Laundry Versi 002  
**Fokus:** peta file, peta fitur, panduan maintenance, dan prinsip anti script sampah
