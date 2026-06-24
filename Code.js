/**
 * ============================================================================
 * KALKULATOR LAUNDRY — DATA OPERASIONAL (multi-cabang)
 * Code.gs — ENTRY POINT & KONSTANTA SKEMA GLOBAL — Schema v4
 * ============================================================================
 *
 * FUNGSI FILE:
 * 1. doGet() sebagai pintu masuk web app.
 * 2. include(filename) untuk memanggil file HTML pecahan.
 * 3. Konstanta skema global.
 *
 * CATATAN PENTING:
 * Index.html sekarang memakai template Apps Script:
 * <?!= include('Style_Tokens'); ?>
 *
 * Maka doGet() WAJIB memakai:
 * HtmlService.createTemplateFromFile("Index").evaluate()
 *
 * Jika memakai createHtmlOutputFromFile("Index"), kode <?!= include(...) ?>
 * akan tampil mentah di browser dan CSS tidak akan terpasang.
 * ============================================================================
 */

const SCHEMA_VERSION = 4;
const DATA_SHEET_NAME = "_data_operasional";
const KEY_META = "meta";
const KEY_CABANG_ORDER = "cabang_order";
const KEY_BIAYA_GAS_ORDER = "biayaGas_order";
const KEY_LEGACY_V1 = "operasional_v1";

/**
 * Entry point Web App.
 * Wajib memakai createTemplateFromFile().evaluate()
 * agar syntax template <?!= include(...) ?> diproses oleh Apps Script.
 */
function doGet() {
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Kalkulator Laundry")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper untuk memanggil file HTML pecahan dari Index.html.
 *
 * Cara pakai di Index.html:
 * <?!= include('Style_Tokens'); ?>
 *
 * Jangan pakai:
 * <?!= include('Style_Tokens.html'); ?>
 */
function include(filename) {
  const cleanName = String(filename || "").trim();

  if (!cleanName) {
    throw new Error("include(filename) gagal: nama file kosong.");
  }

  if (cleanName.indexOf("/") !== -1 || cleanName.indexOf("\\") !== -1) {
    throw new Error("include(filename) gagal: nama file tidak boleh memakai path folder. File: " + cleanName);
  }

  if (/\.html$/i.test(cleanName)) {
    throw new Error(
      "include(filename) gagal: panggil tanpa ekstensi .html. Gunakan include('" +
      cleanName.replace(/\.html$/i, "") +
      "')."
    );
  }

  try {
    return HtmlService.createHtmlOutputFromFile(cleanName).getContent();
  } catch (err) {
    throw new Error(
      "include('" + cleanName + "') gagal. Pastikan file " + cleanName +
      ".html sudah ada di Apps Script. Detail: " +
      (err && err.message ? err.message : String(err))
    );
  }
}

/**
 * Tes cepat dari editor Apps Script.
 * Jalankan fungsi ini, lalu lihat Execution log.
 *
 * Jika template benar, log TIDAK boleh menampilkan:
 * <?!= include('Style_Tokens'); ?>
 */
function testDoGetTemplateOutput() {
  const html = doGet().getContent();
  Logger.log(html.slice(0, 500));

  if (html.indexOf("<?!=") !== -1) {
    throw new Error("Template belum diproses. Cek doGet(): wajib createTemplateFromFile('Index').evaluate().");
  }

  Logger.log("OK: Template sudah diproses. Include tidak tampil mentah.");
}
