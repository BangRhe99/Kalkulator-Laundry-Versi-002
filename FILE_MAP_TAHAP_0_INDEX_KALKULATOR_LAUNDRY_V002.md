# FILE MAP — Tahap 0 Audit Index.html

**Project:** Kalkulator Laundry Versi 002  
**Tujuan dokumen:** memetakan isi `Index.html` sebelum dipecah menjadi file modular. Dokumen ini belum mengubah script aplikasi; hanya audit dan rencana pemecahan agar tahap berikutnya aman.

## 1. Ringkasan Kondisi File Saat Ini

- File sumber audit: `Index.html 24-06-26 002.txt`.
- Total baris: **4,538 baris**.
- Total karakter: **182,599 karakter**.
- Struktur saat ini masih monolitik: CSS, HTML screen, JavaScript helper, JavaScript navigasi, dan JavaScript fitur berada dalam satu file.
- Ada **1 blok `<style>`** pada baris 11–1055.
- Ada **1 blok `<script>`** pada baris 1648–4535.
- Ada **14 screen utama** berbasis `<section class="screen">`.
- Ada sekitar **126 fungsi JavaScript** yang terdeteksi, termasuk fungsi global dan fungsi `window.*`.

## 2. Pedoman yang Dipakai

Pemecahan file harus mengikuti prinsip berikut:

- Setiap file memiliki tanggung jawab yang jelas.
- Fitur tidak boleh saling merusak saat ada perubahan.
- Logic bisnis tidak boleh tumpang tindih.
- UI tidak boleh menjadi tempat hitungan bisnis utama.
- Performa harus cepat: hindari render ulang seluruh halaman jika hanya satu komponen berubah.
- Jika ada perbaikan, sentuh hanya file yang berhubungan langsung.
- Jangan membuat file `final`, `fix`, `baru`, `backup`, atau `coba` di source utama.

## 3. Peta Blok CSS Saat Ini

| Kandidat File | Baris Index Saat Ini | Isi / Fungsi | Catatan Pecah File |
|---|---:|---|---|
| `Style_Tokens.html` | 11–132 | Variabel warna, font, radius, reset dasar awal. | Tahap awal cukup dipindah tanpa mengubah class atau isi CSS. |
| `Style_Components_Menu_List_Form.html` | 134–623 | Komponen umum: menu, card cabang, panel, field, input, pill, footer, toast, modal, responsive base. | Tahap awal cukup dipindah tanpa mengubah class atau isi CSS. |
| `Style_Module_MasterBiaya.html` | 624–816 | Style khusus Master Biaya: pick cabang, gas, listrik. | Tahap awal cukup dipindah tanpa mengubah class atau isi CSS. |
| `Style_Module_HPP.html` | 817–984 | Style khusus Struktur Biaya HPP. | Tahap awal cukup dipindah tanpa mengubah class atau isi CSS. |
| `Style_Module_FixedCost.html` | 985–1054 | Style khusus Fixed Cost. Saat fitur Harga Layanan sudah masuk, style Harga Layanan idealnya berdiri sendiri. | Tahap awal cukup dipindah tanpa mengubah class atau isi CSS. |

### Catatan CSS

- `Style_Tokens.html` sebaiknya hanya berisi `:root`, reset dasar, font, warna, radius, dan token global.
- `Style_Components.html` nantinya perlu menampung komponen umum seperti `.menu-card`, `.panel`, `.field`, `.pill`, `.toast`, `.empty-state`, `.footer-bar`, dan `.pick-cabang-row`.
- CSS fitur jangan dicampur dengan CSS global, agar perubahan tampilan satu fitur tidak merusak fitur lain.

## 4. Peta HTML Screen Saat Ini

| Kandidat File | Screen ID | Baris Index Saat Ini | Fungsi Screen | Catatan Pecah File |
|---|---|---:|---|---|
| `Screen_Menu.html` | `screenMenu` | 1081–1126 | Menu utama aplikasi. | Jangan ubah ID elemen saat dipindah. |
| `Screen_Cabang.html` | `screenList` | 1127–1139 | Cabang & Lokasi: daftar, ringkasan, dan form outlet. | Jangan ubah ID elemen saat dipindah. |
| `Screen_Cabang.html` | `screenRingkasan` | 1140–1198 | Cabang & Lokasi: daftar, ringkasan, dan form outlet. | Jangan ubah ID elemen saat dipindah. |
| `Screen_Cabang.html` | `screenForm` | 1199–1342 | Cabang & Lokasi: daftar, ringkasan, dan form outlet. | Jangan ubah ID elemen saat dipindah. |
| `Screen_MasterBiaya.html` | `screenMasterBiaya` | 1343–1366 | Master Biaya: kategori, gas, listrik, air, nota/admin. | Jangan ubah ID elemen saat dipindah. |
| `Screen_MasterBiaya.html` | `screenGasList` | 1367–1382 | Master Biaya: kategori, gas, listrik, air, nota/admin. | Jangan ubah ID elemen saat dipindah. |
| `Screen_MasterBiaya.html` | `screenGasForm` | 1383–1454 | Master Biaya: kategori, gas, listrik, air, nota/admin. | Jangan ubah ID elemen saat dipindah. |
| `Screen_MasterBiaya.html` | `screenListrikForm` | 1455–1510 | Master Biaya: kategori, gas, listrik, air, nota/admin. | Jangan ubah ID elemen saat dipindah. |
| `Screen_MasterBiaya.html` | `screenAirForm` | 1511–1541 | Master Biaya: kategori, gas, listrik, air, nota/admin. | Jangan ubah ID elemen saat dipindah. |
| `Screen_MasterBiaya.html` | `screenNotaKasirForm` | 1542–1567 | Master Biaya: kategori, gas, listrik, air, nota/admin. | Jangan ubah ID elemen saat dipindah. |
| `Screen_HPP.html` | `screenStrukturHPPList` | 1568–1583 | Struktur Biaya HPP: daftar outlet dan detail HPP. | Jangan ubah ID elemen saat dipindah. |
| `Screen_HPP.html` | `screenStrukturHPPDetail` | 1584–1599 | Struktur Biaya HPP: daftar outlet dan detail HPP. | Jangan ubah ID elemen saat dipindah. |
| `Screen_FixedCost.html` | `screenBiayaTetapList` | 1600–1615 | Fixed Cost: daftar outlet, ringkasan, dan form biaya tetap. | Jangan ubah ID elemen saat dipindah. |
| `Screen_FixedCost.html` | `screenBiayaTetapForm` | 1616–1647 | Fixed Cost: daftar outlet, ringkasan, dan form biaya tetap. | Jangan ubah ID elemen saat dipindah. |

### Catatan HTML Screen

- Tahap pecah HTML harus **mempertahankan semua ID elemen**, karena JavaScript saat ini banyak memanggil elemen langsung via `document.getElementById(...)`.
- File screen hanya boleh berisi HTML tampilan, bukan CSS dan bukan JavaScript.
- Fitur `Harga Layanan` belum ada di file sumber audit asli ini. Jika versi terbaru sudah berisi Harga Layanan, nanti file `Screen_HargaLayanan.html` wajib dibuat terpisah.

## 5. Peta JavaScript Saat Ini

| Kandidat File | Baris Index Saat Ini | Isi Utama | Catatan Pecah File |
|---|---:|---|---|
| `Script_Shared_Formatter.html + Script_Shared_Helper.html + Script_Shared_UI.html` | 1690–1857 | Shared / helper umum | Pindah bertahap, jangan ganti nama fungsi dulu. |
| `Script_Core_State.html + Script_Core_Navigation.html` | 1858–2109 | Core navigation & footer | Pindah bertahap, jangan ganti nama fungsi dulu. |
| `Script_Module_Cabang.html` | 2110–2579 | Cabang & Lokasi | Pindah bertahap, jangan ganti nama fungsi dulu. |
| `Script_Module_MasterBiaya.html` | 2580–2640 | Master Biaya - kategori & pick cabang | Pindah bertahap, jangan ganti nama fungsi dulu. |
| `Script_Module_MasterBiaya_Gas.html atau tetap di Script_Module_MasterBiaya.html tahap awal` | 2641–3088 | Master Biaya - Gas | Pindah bertahap, jangan ganti nama fungsi dulu. |
| `Script_Module_MasterBiaya_Listrik.html atau tetap di Script_Module_MasterBiaya.html tahap awal` | 3089–3312 | Master Biaya - Listrik | Pindah bertahap, jangan ganti nama fungsi dulu. |
| `Script_Module_MasterBiaya_AirNota.html atau tetap di Script_Module_MasterBiaya.html tahap awal` | 3313–3853 | Master Biaya - Air & Nota Kasir | Pindah bertahap, jangan ganti nama fungsi dulu. |
| `Script_Module_HPP.html` | 3854–4100 | Struktur Biaya HPP | Pindah bertahap, jangan ganti nama fungsi dulu. |
| `Script_Module_FixedCost.html` | 4101–4534 | Biaya Tetap Outlet / Fixed Cost | Pindah bertahap, jangan ganti nama fungsi dulu. |

## 6. Daftar Fungsi dan Kandidat File

### Shared / helper umum — baris 1690–1857

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `localId()` | 1700–1704 | `Script_Shared_Formatter/Helper/UI.html` |
| `round2()` | 1705–1708 | `Script_Shared_Formatter/Helper/UI.html` |
| `formatNum()` | 1709–1711 | `Script_Shared_Formatter/Helper/UI.html` |
| `formatRupiah()` | 1712–1715 | `Script_Shared_Formatter/Helper/UI.html` |
| `pad2()` | 1716–1717 | `Script_Shared_Formatter/Helper/UI.html` |
| `showToast()` | 1718–1724 | `Script_Shared_Formatter/Helper/UI.html` |
| `setSaveStatus()` | 1725–1736 | `Script_Shared_Formatter/Helper/UI.html` |
| `handleBackendError()` | 1737–1744 | `Script_Shared_Formatter/Helper/UI.html` |
| `computeDurasiOperasional()` | 1745–1750 | `Script_Shared_Formatter/Helper/UI.html` |
| `computeGroupLoad()` | 1751–1774 | `Script_Shared_Formatter/Helper/UI.html` |
| `computeSummary()` | 1775–1789 | `Script_Shared_Formatter/Helper/UI.html` |
| `computeBiayaGasSummaryClient()` | 1790–1810 | `Script_Shared_Formatter/Helper/UI.html` |
| `formatJam()` | 1811–1819 | `Script_Shared_Formatter/Helper/UI.html` |
| `machineDisplayName()` | 1820–1857 | `Script_Shared_Formatter/Helper/UI.html` |

### Core navigation & footer — baris 1858–2109

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `showScreen()` | 1858–1867 | `Script_Core_Navigation.html` |
| `window.goBack()` | 1868–1929 | `Script_Core_Navigation.html` |
| `window.openScreenCabangList()` | 1930–1934 | `Script_Core_Navigation.html` |
| `window.openScreenMasterBiaya()` | 1935–1939 | `Script_Core_Navigation.html` |
| `renderFooter()` | 1940–2109 | `Script_Core_Navigation.html` |

### Cabang & Lokasi — baris 2110–2579

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `window.goBackToList()` | 2110–2114 | `Script_Module_Cabang.html` |
| `refreshList()` | 2115–2128 | `Script_Module_Cabang.html` |
| `renderList()` | 2129–2167 | `Script_Module_Cabang.html` |
| `escapeHtml()` | 2168–2173 | `Script_Module_Cabang.html` |
| `openRingkasan()` | 2174–2196 | `Script_Module_Cabang.html` |
| `renderRingkasanLoading()` | 2197–2202 | `Script_Module_Cabang.html` |
| `renderRingkasan()` | 2203–2226 | `Script_Module_Cabang.html` |
| `renderMachineSummaryDetail()` | 2227–2247 | `Script_Module_Cabang.html` |
| `openConfirmDelete()` | 2248–2258 | `Script_Module_Cabang.html` |
| `window.closeConfirm()` | 2259–2262 | `Script_Module_Cabang.html` |
| `confirmDelete()` | 2263–2285 | `Script_Module_Cabang.html` |
| `defaultCabang()` | 2286–2298 | `Script_Module_Cabang.html` |
| `window.openFormNew()` | 2299–2307 | `Script_Module_Cabang.html` |
| `openFormEdit()` | 2308–2332 | `Script_Module_Cabang.html` |
| `buildTimeOptions()` | 2333–2342 | `Script_Module_Cabang.html` |
| `initTimeSelects()` | 2343–2349 | `Script_Module_Cabang.html` |
| `renderDurasiReadout()` | 2350–2361 | `Script_Module_Cabang.html` |
| `machineRowTemplate()` | 2362–2399 | `Script_Module_Cabang.html` |
| `renderMachineList()` | 2400–2409 | `Script_Module_Cabang.html` |
| `renderFormOutputs()` | 2410–2427 | `Script_Module_Cabang.html` |
| `renderOkupansiUI()` | 2428–2434 | `Script_Module_Cabang.html` |
| `renderKategoriUI()` | 2435–2440 | `Script_Module_Cabang.html` |
| `renderForm()` | 2441–2455 | `Script_Module_Cabang.html` |
| `updateMachineField()` | 2456–2463 | `Script_Module_Cabang.html` |
| `window.removeMachine()` | 2464–2469 | `Script_Module_Cabang.html` |
| `window.addMachine()` | 2470–2481 | `Script_Module_Cabang.html` |
| `window.togglePanel()` | 2482–2485 | `Script_Module_Cabang.html` |
| `bindStaticFormInputs()` | 2486–2490 | `Script_Module_Cabang.html` |
| `bindTime()` | 2491–2491 | `Script_Module_Cabang.html` |
| `update()` | 2492–2526 | `Script_Module_Cabang.html` |
| `saveForm()` | 2527–2531 | `Script_Module_Cabang.html` |
| `onDone()` | 2532–2579 | `Script_Module_Cabang.html` |

### Master Biaya - kategori & pick cabang — baris 2580–2640

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `window.selectKategoriBiaya()` | 2580–2588 | `Script_Module_MasterBiaya.html` |
| `refreshBiayaPickCabangList()` | 2589–2607 | `Script_Module_MasterBiaya.html` |
| `renderBiayaPickCabangList()` | 2608–2640 | `Script_Module_MasterBiaya.html` |

### Master Biaya - Gas — baris 2641–3088

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `openGasList()` | 2641–2670 | `Script_Module_MasterBiaya.html` |
| `renderGasList()` | 2671–2730 | `Script_Module_MasterBiaya.html` |
| `openConfirmDeleteGas()` | 2731–2740 | `Script_Module_MasterBiaya.html` |
| `confirmDeleteGas()` | 2741–2762 | `Script_Module_MasterBiaya.html` |
| `defaultGasRecord()` | 2763–2776 | `Script_Module_MasterBiaya.html` |
| `getCabangLiteFromCache()` | 2777–2780 | `Script_Module_MasterBiaya.html` |
| `defaultNotaKasirRecordClient()` | 2781–2799 | `Script_Module_MasterBiaya.html` |
| `syncNotaKasirPillStates()` | 2800–2813 | `Script_Module_MasterBiaya.html` |
| `window.openGasFormNew()` | 2814–2824 | `Script_Module_MasterBiaya.html` |
| `openGasFormEdit()` | 2825–2854 | `Script_Module_MasterBiaya.html` |
| `renderGasKapasitasPills()` | 2855–2897 | `Script_Module_MasterBiaya.html` |
| `selectGasPreset()` | 2898–2910 | `Script_Module_MasterBiaya.html` |
| `selectGasCustom()` | 2911–2924 | `Script_Module_MasterBiaya.html` |
| `renderGasDryerOptions()` | 2925–2954 | `Script_Module_MasterBiaya.html` |
| `syncGasFormFieldsFromState()` | 2955–2959 | `Script_Module_MasterBiaya.html` |
| `renderGasForm()` | 2960–2972 | `Script_Module_MasterBiaya.html` |
| `renderGasFormPreview()` | 2973–2993 | `Script_Module_MasterBiaya.html` |
| `bindGasFormInputs()` | 2994–3019 | `Script_Module_MasterBiaya.html` |
| `saveGasForm()` | 3020–3045 | `Script_Module_MasterBiaya.html` |
| `onDone()` | 3046–3088 | `Script_Module_MasterBiaya.html` |

### Master Biaya - Listrik — baris 3089–3312

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `listrikMachineLabel()` | 3089–3098 | `Script_Module_MasterBiaya.html` |
| `computeBiayaListrikSummaryClient()` | 3099–3105 | `Script_Module_MasterBiaya.html` |
| `computeBaris()` | 3106–3144 | `Script_Module_MasterBiaya.html` |
| `openListrikForm()` | 3145–3173 | `Script_Module_MasterBiaya.html` |
| `syncListrikFieldsFromState()` | 3174–3180 | `Script_Module_MasterBiaya.html` |
| `renderListrikForm()` | 3181–3191 | `Script_Module_MasterBiaya.html` |
| `renderListrikRincian()` | 3192–3240 | `Script_Module_MasterBiaya.html` |
| `renderListrikPreview()` | 3241–3262 | `Script_Module_MasterBiaya.html` |
| `saveListrikFormManual()` | 3263–3289 | `Script_Module_MasterBiaya.html` |
| `bindListrikFormInputs()` | 3290–3312 | `Script_Module_MasterBiaya.html` |

### Master Biaya - Air & Nota Kasir — baris 3313–3853

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `openAirForm()` | 3313–3341 | `Script_Module_MasterBiaya.html` |
| `openNotaKasirForm()` | 3342–3375 | `Script_Module_MasterBiaya.html` |
| `selectNotaKasirSistem()` | 3376–3389 | `Script_Module_MasterBiaya.html` |
| `selectNotaKasirMetode()` | 3390–3398 | `Script_Module_MasterBiaya.html` |
| `renderNotaKasirForm()` | 3399–3525 | `Script_Module_MasterBiaya.html` |
| `renderNotaKasirPreview()` | 3526–3540 | `Script_Module_MasterBiaya.html` |
| `computeNotaKasirPreview()` | 3541–3608 | `Script_Module_MasterBiaya.html` |
| `saveNotaKasirForm()` | 3609–3657 | `Script_Module_MasterBiaya.html` |
| `selectAirSumber()` | 3658–3663 | `Script_Module_MasterBiaya.html` |
| `renderAirForm()` | 3664–3750 | `Script_Module_MasterBiaya.html` |
| `renderAirPreview()` | 3751–3766 | `Script_Module_MasterBiaya.html` |
| `computeAirSummary()` | 3767–3794 | `Script_Module_MasterBiaya.html` |
| `saveAirForm()` | 3795–3853 | `Script_Module_MasterBiaya.html` |

### Struktur Biaya HPP — baris 3854–4100

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `window.openStrukturHPPOutletList()` | 3854–3864 | `Script_Module_HPP.html` |
| `renderFromCache()` | 3865–3937 | `Script_Module_HPP.html` |
| `window.openStrukturHPPDetail()` | 3938–3988 | `Script_Module_HPP.html` |
| `renderStrukturHPP()` | 3989–4033 | `Script_Module_HPP.html` |
| `renderStrukturHPPServiceCard()` | 4034–4056 | `Script_Module_HPP.html` |
| `renderStrukturHPPComponentRow()` | 4057–4077 | `Script_Module_HPP.html` |
| `formatRupiahTanpaDesimal()` | 4078–4086 | `Script_Module_HPP.html` |
| `escapeJsAttr()` | 4087–4100 | `Script_Module_HPP.html` |

### Biaya Tetap Outlet / Fixed Cost — baris 4101–4534

| Fungsi | Baris | Kandidat File |
|---|---:|---|
| `window.openBiayaTetapOutletList()` | 4101–4128 | `Script_Module_FixedCost.html` |
| `renderBiayaTetapOutletList()` | 4129–4177 | `Script_Module_FixedCost.html` |
| `window.openBiayaTetapOutletForm()` | 4178–4206 | `Script_Module_FixedCost.html` |
| `renderBiayaTetapOutletForm()` | 4207–4264 | `Script_Module_FixedCost.html` |
| `renderBiayaTetapGajiRows()` | 4265–4270 | `Script_Module_FixedCost.html` |
| `createBiayaTetapGajiRowHtml()` | 4271–4282 | `Script_Module_FixedCost.html` |
| `renderBiayaTetapDepresiasiRows()` | 4283–4288 | `Script_Module_FixedCost.html` |
| `createBiayaTetapDepresiasiRowHtml()` | 4289–4301 | `Script_Module_FixedCost.html` |
| `renderBiayaTetapOtherRows()` | 4302–4307 | `Script_Module_FixedCost.html` |
| `createBiayaTetapOtherRowHtml()` | 4308–4319 | `Script_Module_FixedCost.html` |
| `window.addBiayaTetapGajiRow()` | 4320–4326 | `Script_Module_FixedCost.html` |
| `window.addBiayaTetapOtherRow()` | 4327–4333 | `Script_Module_FixedCost.html` |
| `window.removeBiayaTetapRow()` | 4334–4339 | `Script_Module_FixedCost.html` |
| `getInputNumber()` | 4340–4346 | `Script_Module_FixedCost.html` |
| `money0()` | 4347–4348 | `Script_Module_FixedCost.html` |
| `window.refreshBiayaTetapPreview()` | 4349–4379 | `Script_Module_FixedCost.html` |
| `collectBiayaTetapPayload()` | 4380–4425 | `Script_Module_FixedCost.html` |
| `calculateBiayaTetapSummaryClient()` | 4426–4468 | `Script_Module_FixedCost.html` |
| `sumClient()` | 4469–4473 | `Script_Module_FixedCost.html` |
| `saveBiayaTetapOutletCurrent()` | 4474–4500 | `Script_Module_FixedCost.html` |
| `deleteBiayaTetapOutletCurrent()` | 4501–4534 | `Script_Module_FixedCost.html` |

## 7. Kandidat Struktur File Setelah Pecah

| File | Fungsi |
|---|---|
| `Index.html` | Kerangka utama: memanggil style, layout, screen, shared script, core script, dan module script. |
| `Layout_AppShell.html` | Header aplikasi, tombol back, brand, save status, loading state, appRoot, toast, confirm modal, footer. |
| `Style_Tokens.html` | Token desain: warna, font, radius, border, variabel global. |
| `Style_Base.html` | Reset, body, wrapper, header, screen, responsive dasar. |
| `Style_Components.html` | Komponen umum: menu card, panel, field, input, pill, toast, modal, footer, empty state. |
| `Style_Module_MasterBiaya.html` | CSS khusus Master Biaya. |
| `Style_Module_HPP.html` | CSS khusus Struktur Biaya HPP. |
| `Style_Module_HargaLayanan.html` | CSS khusus Harga Layanan. |
| `Style_Module_FixedCost.html` | CSS khusus Fixed Cost. |
| `Screen_Menu.html` | HTML menu utama. |
| `Screen_Cabang.html` | HTML Cabang & Lokasi. |
| `Screen_MasterBiaya.html` | HTML Master Biaya. |
| `Screen_HPP.html` | HTML Struktur Biaya HPP. |
| `Screen_HargaLayanan.html` | HTML Harga Layanan. |
| `Screen_FixedCost.html` | HTML Fixed Cost. |
| `Script_Shared_Formatter.html` | Formatter umum: rupiah, angka, persen, jam. |
| `Script_Shared_Helper.html` | Helper umum: escapeHtml, round, ID lokal, helper data. |
| `Script_Shared_UI.html` | Toast, save status, error handler, empty state. |
| `Script_Core_State.html` | State global dan cache aplikasi. |
| `Script_Core_Navigation.html` | showScreen, goBack, footer, mapping screen. |
| `Script_Core_Init.html` | Inisialisasi awal dan binding event global. |
| `Script_Module_Cabang.html` | Frontend controller Cabang & Lokasi. |
| `Script_Module_MasterBiaya.html` | Frontend controller Master Biaya. Bisa dipecah lagi ke Gas/Listrik/Air/Nota setelah stabil. |
| `Script_Module_HPP.html` | Frontend controller Struktur Biaya HPP. |
| `Script_Module_HargaLayanan.html` | Frontend controller Harga Layanan. |
| `Script_Module_FixedCost.html` | Frontend controller Fixed Cost. |

## 8. Rekomendasi Urutan Pecah Berikutnya

Tahap berikutnya yang paling aman adalah **Tahap 1 — siapkan include dan kerangka Index baru**, lalu **Tahap 2 — pecah CSS global**.

Urutan aman:

1. Pastikan `Code.js` memiliki fungsi `include(filename)`.
2. Buat versi `Index.html` kerangka, tetapi belum mengubah logic.
3. Pecah CSS global terlebih dahulu.
4. Test tampilan menu, daftar cabang, form cabang, Master Biaya, HPP, dan Fixed Cost.
5. Lanjut pecah CSS per fitur setelah stabil.

## 9. Risiko yang Harus Dijaga

- Jangan mengubah ID HTML saat memecah screen.
- Jangan mengubah nama function saat memecah JavaScript.
- Jangan membuat fungsi dobel dengan tujuan sama.
- Jangan memindahkan logic bisnis ke file UI.
- Jangan membuat file cadangan di project Apps Script.
- Jangan mencampur fitur Harga Layanan ke HPP atau Fixed Cost.
- Jika data cache dipakai lintas fitur, buat helper normalisasi data outlet agar bug `ID outlet tidak valid` tidak muncul lagi.

## 10. Kesimpulan Tahap 0

Index saat ini bisa dipecah dengan aman, tetapi harus bertahap. Urutan paling aman adalah: CSS global → CSS fitur → HTML screen → shared JS → core JS → JS per fitur → backend. Tahap berikutnya sebaiknya tidak langsung memecah semua JavaScript, karena bagian navigation dan state adalah area paling sensitif.

---

Dokumen ini adalah hasil audit, bukan file aplikasi final. Gunakan sebagai peta kerja sebelum eksekusi Tahap 1.