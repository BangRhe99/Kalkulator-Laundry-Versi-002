/**
 * ============================================================================
 * KALKULATOR LAUNDRY — DATA OPERASIONAL
 * Code.gs — ENTRY POINT & KONSTANTA SKEMA GLOBAL
 * Schema v4
 * ============================================================================
 *
 * FUNGSI FILE:
 * 1. doGet() sebagai pintu masuk utama Web App.
 * 2. include(filename) untuk memanggil file HTML pecahan.
 * 3. Konstanta skema global yang dipakai lintas modul.
 *
 * CATATAN PENTING:
 * Index.html saat ini sudah memakai sistem include file HTML.
 * Karena itu doGet() wajib memakai createTemplateFromFile().evaluate().
 * Jangan memakai createHtmlOutputFromFile() untuk Index.html.
 * ============================================================================
 */


/* ============================================================================
   KONSTANTA SKEMA GLOBAL
============================================================================ */

var SCHEMA_VERSION = 4;
var DATA_SHEET_NAME = "_data_operasional";

var KEY_META = "meta";
var KEY_CABANG_ORDER = "cabang_order";
var KEY_BIAYA_GAS_ORDER = "biayaGas_order";
var KEY_LEGACY_V1 = "operasional_v1";


/* ============================================================================
   ENTRY POINT WEB APP
============================================================================ */

/**
 * Pintu masuk utama Web App.
 * Wajib memakai createTemplateFromFile().evaluate()
 * supaya include file HTML di Index.html diproses oleh Apps Script.
 */
function doGet(e) {
  return HtmlService
    .createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Kalkulator Laundry")
    .addMetaTag(
      "viewport",
      "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/* ============================================================================
   HELPER INCLUDE HTML
============================================================================ */

/**
 * Helper untuk memanggil file HTML pecahan dari Index.html.
 *
 * Contoh pemakaian di Index.html:
 * include nama file tanpa ekstensi .html
 *
 * Benar:
 * include('Style_Tokens')
 *
 * Salah:
 * include('Style_Tokens.html')
 */
function include(filename) {
  var cleanName = String(filename || "").trim();

  if (!cleanName) {
    throw new Error("include(filename) gagal: nama file kosong.");
  }

  if (cleanName.indexOf("/") !== -1 || cleanName.indexOf("\\") !== -1) {
    throw new Error(
      "include(filename) gagal: nama file tidak boleh memakai path folder. File: " +
      cleanName
    );
  }

  if (/\.html$/i.test(cleanName)) {
    throw new Error(
      "include(filename) gagal: panggil tanpa ekstensi .html. Gunakan include('" +
      cleanName.replace(/\.html$/i, "") +
      "')."
    );
  }

  try {
    return HtmlService
      .createHtmlOutputFromFile(cleanName)
      .getContent();
  } catch (err) {
    throw new Error(
      "include('" + cleanName + "') gagal. Pastikan file " +
      cleanName +
      ".html sudah ada di Apps Script. Detail: " +
      (err && err.message ? err.message : String(err))
    );
  }
}


/* ============================================================================
   TEST TEMPLATE OUTPUT
============================================================================ */

/**
 * Tes cepat dari editor Apps Script.
 *
 * Cara pakai:
 * 1. Pilih function testDoGetTemplateOutput.
 * 2. Klik Run.
 * 3. Buka Execution log.
 *
 * Jika berhasil, log akan menampilkan:
 * OK: Template sudah diproses.
 */
function testDoGetTemplateOutput() {
  var html = doGet({}).getContent();

  Logger.log(html.slice(0, 500));

  if (html.indexOf("<?") !== -1) {
    throw new Error(
      "Template belum diproses. Cek doGet(): wajib memakai createTemplateFromFile('Index').evaluate()."
    );
  }

  Logger.log("OK: Template sudah diproses. Include tidak tampil mentah.");
}