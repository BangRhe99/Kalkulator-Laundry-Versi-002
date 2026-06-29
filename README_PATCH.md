# Patch Skeleton Loading — Kalkulator Laundry Versi 002

Isi patch:

1. `Code.gs`
   - Mengganti `HtmlService.createHtmlOutputFromFile("Index")` menjadi `HtmlService.createTemplateFromFile("Index").evaluate()`.
   - Menambahkan fungsi `include(filename)`.
   - Menambahkan test `testDoGetTemplateOutput()`.

2. `.claspignore`
   - Menghapus karakter BOM tersembunyi di awal file.
   - Membetulkan typo `Script_Shared_Fromatter.html` menjadi `Script_Shared_Formatter.html`.
   - Menghapus whitelist file `.gs` yang tidak ada di repo saat ini agar tidak menyesatkan.

Catatan:
- Patch ini fokus memperbaiki skeleton loading yang macet karena include Apps Script tidak diproses.
- Fitur HPP, Fixed Cost, dan Harga Layanan backend masih perlu dipastikan file `.gs`-nya benar-benar ikut push apabila file yang aktif masih bernama `.js` di repo.
