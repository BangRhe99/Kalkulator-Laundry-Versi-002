/**
 * ====================================================================
 * MODUL: MASTER BIAYA — NOTA & KASIR
 * ====================================================================
 * Fitur ini mengelola satu konfigurasi biaya nota/kasir per cabang.
 * Disimpan di sheet terpisah "BiayaNotaKasir" dengan satu baris per cabang.
 *
 * PUBLIC FUNCTIONS:
 *   - getBiayaNotaKasir(cabangId)
 *   - saveBiayaNotaKasir(cabangId, payload)
 *
 * OPTIONAL DEPENDENCIES:
 *   - ensureMigrated_()
 *   - getCabang(cabangId)
 *   - errorResponse_(err, stage)
 * ====================================================================
 */

// ============================================================================
// SECTION: KONSTANTA & DEFAULT
// ============================================================================

const BIAYA_NOTA_KASIR_SHEET_NAME_ = "BiayaNotaKasir";

const BIAYA_NOTA_KASIR_HEADERS_ = [
  "id",
  "cabangId",
  "sistemNotaKasir",
  "metodeBiayaAplikasi",
  "biayaPerTransaksi",
  "biayaBulananAplikasi",
  "estimasiTransaksiPerBulan",
  "hargaPerRoll",
  "transaksiPerRoll",
  "hargaSatuanAwalNota",
  "jumlahLembarNota",
  "notaPerTransaksi",
  "createdAt",
  "updatedAt"
];

function defaultBiayaNotaKasirRecord_(cabangId) {
  return {
    id: "",
    cabangId: cabangId || "",

    // aplikasi_kasir_thermal | nota_manual_ncr
    sistemNotaKasir: "aplikasi_kasir_thermal",

    // biaya_langsung_per_transaksi | biaya_bulanan_dibagi_transaksi | gratis_tanpa_biaya_admin
    metodeBiayaAplikasi: "biaya_langsung_per_transaksi",

    // Aplikasi kasir thermal
    biayaPerTransaksi: 155,
    biayaBulananAplikasi: 0,
    estimasiTransaksiPerBulan: 0,

    // Nota thermal
    hargaPerRoll: 1500,
    transaksiPerRoll: 30,

    // Nota manual NCR
    hargaSatuanAwalNota: 30000,
    jumlahLembarNota: 150,
    notaPerTransaksi: 3,

    createdAt: null,
    updatedAt: null
  };
}

// ============================================================================
// SECTION: HELPER UMUM KHUSUS MODUL INI
// ============================================================================

function notaKasirToNumber_(value, fallback) {
  if (value === null || value === undefined || value === "") {
    return fallback || 0;
  }

  if (typeof value === "number") {
    return isFinite(value) ? value : (fallback || 0);
  }

  let text = String(value).trim();

  // Bersihkan format Rupiah sederhana: "Rp 1.500,50" / "1,500.50"
  text = text.replace(/[^\d,.-]/g, "");

  // Jika ada koma dan titik, anggap titik pemisah ribuan dan koma desimal.
  if (text.indexOf(",") > -1 && text.indexOf(".") > -1) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else if (text.indexOf(",") > -1) {
    text = text.replace(",", ".");
  }

  const num = Number(text);
  return isFinite(num) ? num : (fallback || 0);
}

function notaKasirClamp_(value, min, max) {
  const num = notaKasirToNumber_(value, 0);
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

function notaKasirRound2_(value) {
  const num = notaKasirToNumber_(value, 0);
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function notaKasirNewId_(prefix) {
  const p = prefix || "n";
  return p + "_" + new Date().getTime() + "_" + Math.random().toString(36).slice(2, 8);
}

function notaKasirErrorResponse_(err, stage) {
  if (typeof errorResponse_ === "function") {
    return errorResponse_(err, stage);
  }

  return {
    ok: false,
    error: err && err.message ? err.message : String(err),
    stage: stage || "notaKasir:unknown"
  };
}

function notaKasirGetValue_(input, primaryKey, fallback, aliases) {
  if (!input || typeof input !== "object") return fallback;

  if (input[primaryKey] !== undefined && input[primaryKey] !== null && input[primaryKey] !== "") {
    return input[primaryKey];
  }

  aliases = aliases || [];
  for (let i = 0; i < aliases.length; i++) {
    const key = aliases[i];
    if (input[key] !== undefined && input[key] !== null && input[key] !== "") {
      return input[key];
    }
  }

  return fallback;
}

// ============================================================================
// SECTION: SHEET STORAGE
// ============================================================================

function getBiayaNotaKasirSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error("Spreadsheet aktif tidak ditemukan. Pastikan Apps Script terhubung ke Google Sheet.");
  }

  let sheet = ss.getSheetByName(BIAYA_NOTA_KASIR_SHEET_NAME_);

  if (!sheet) {
    sheet = ss.insertSheet(BIAYA_NOTA_KASIR_SHEET_NAME_);
    sheet.getRange(1, 1, 1, BIAYA_NOTA_KASIR_HEADERS_.length).setValues([BIAYA_NOTA_KASIR_HEADERS_]);
    sheet.setFrozenRows(1);
  } else {
    ensureBiayaNotaKasirHeaders_(sheet);
  }

  return sheet;
}

function ensureBiayaNotaKasirHeaders_(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), BIAYA_NOTA_KASIR_HEADERS_.length);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, BIAYA_NOTA_KASIR_HEADERS_.length).setValues([BIAYA_NOTA_KASIR_HEADERS_]);
    sheet.setFrozenRows(1);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

  let shouldRewrite = false;
  for (let i = 0; i < BIAYA_NOTA_KASIR_HEADERS_.length; i++) {
    if (currentHeaders[i] !== BIAYA_NOTA_KASIR_HEADERS_[i]) {
      shouldRewrite = true;
      break;
    }
  }

  if (shouldRewrite) {
    sheet.getRange(1, 1, 1, BIAYA_NOTA_KASIR_HEADERS_.length).setValues([BIAYA_NOTA_KASIR_HEADERS_]);
    sheet.setFrozenRows(1);
  }
}

function rowArrayToBiayaNotaKasirObject_(values) {
  const obj = {};

  for (let i = 0; i < BIAYA_NOTA_KASIR_HEADERS_.length; i++) {
    obj[BIAYA_NOTA_KASIR_HEADERS_[i]] = values[i];
  }

  return obj;
}

function buildBiayaNotaKasirRow_(record) {
  return [
    record.id,
    record.cabangId,
    record.sistemNotaKasir,
    record.metodeBiayaAplikasi,
    record.biayaPerTransaksi,
    record.biayaBulananAplikasi,
    record.estimasiTransaksiPerBulan,
    record.hargaPerRoll,
    record.transaksiPerRoll,
    record.hargaSatuanAwalNota,
    record.jumlahLembarNota,
    record.notaPerTransaksi,
    record.createdAt,
    record.updatedAt
  ];
}

function findBiayaNotaKasirRowFast_(sheet, cabangId) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return -1;

  const target = String(cabangId || "");
  const cabangIdColumn = 2;
  const values = sheet.getRange(2, cabangIdColumn, lastRow - 1, 1).getValues();

  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0] || "") === target) {
      return i + 2;
    }
  }

  return -1;
}

function getCabangInfoNotaKasir_(cabangId) {
  if (!cabangId || typeof cabangId !== "string") {
    return { id: "", namaLaundry: "" };
  }

  if (typeof getCabang === "function") {
    try {
      const res = getCabang(cabangId);

      if (res && res.ok && res.data && res.data.cabang) {
        const cabang = res.data.cabang;
        const namaLaundry =
          cabang.profil && cabang.profil.namaLaundry
            ? String(cabang.profil.namaLaundry)
            : "";

        return {
          id: cabangId,
          namaLaundry: namaLaundry
        };
      }
    } catch (e) {
      console.warn("[NotaKasir] getCabang gagal, lanjut tanpa nama laundry:", e);
    }
  }

  return {
    id: cabangId,
    namaLaundry: ""
  };
}

// ============================================================================
// SECTION: NORMALIZE & VALIDASI
// ============================================================================

function normalizeBiayaNotaKasirRecord_(input, cabangId) {
  const base = defaultBiayaNotaKasirRecord_(cabangId);
  const out = {};

  out.id = notaKasirGetValue_(input, "id", base.id);
  out.id = out.id ? String(out.id) : "";

  out.cabangId = cabangId || notaKasirGetValue_(input, "cabangId", base.cabangId);
  out.cabangId = out.cabangId ? String(out.cabangId) : "";

  out.sistemNotaKasir = String(
    notaKasirGetValue_(input, "sistemNotaKasir", base.sistemNotaKasir, [
      "sistem",
      "jenisNotaKasir"
    ])
  );

  out.metodeBiayaAplikasi = String(
    notaKasirGetValue_(input, "metodeBiayaAplikasi", base.metodeBiayaAplikasi, [
      "metode",
      "metodeBiaya"
    ])
  );

  out.biayaPerTransaksi = notaKasirClamp_(
    notaKasirGetValue_(input, "biayaPerTransaksi", base.biayaPerTransaksi, [
      "biayaAplikasiPerTransaksi",
      "biayaLangsungPerTransaksi"
    ]),
    0,
    100000000
  );

  out.biayaBulananAplikasi = notaKasirClamp_(
    notaKasirGetValue_(input, "biayaBulananAplikasi", base.biayaBulananAplikasi, [
      "biayaBulanan",
      "biayaAplikasiBulanan"
    ]),
    0,
    100000000
  );

  out.estimasiTransaksiPerBulan = notaKasirClamp_(
    notaKasirGetValue_(input, "estimasiTransaksiPerBulan", base.estimasiTransaksiPerBulan, [
      "estimasiTransaksiBulanan",
      "transaksiPerBulan"
    ]),
    0,
    100000000
  );

  out.hargaPerRoll = notaKasirClamp_(
    notaKasirGetValue_(input, "hargaPerRoll", base.hargaPerRoll, [
      "hargaNotaPerRoll",
      "hargaRoll"
    ]),
    0,
    100000000
  );

  out.transaksiPerRoll = notaKasirClamp_(
    notaKasirGetValue_(input, "transaksiPerRoll", base.transaksiPerRoll, [
      "jumlahTransaksiPerRoll"
    ]),
    0,
    100000000
  );

  out.hargaSatuanAwalNota = notaKasirClamp_(
    notaKasirGetValue_(input, "hargaSatuanAwalNota", base.hargaSatuanAwalNota, [
      "hargaNotaManual",
      "hargaNotaNcr",
      "hargaAwalNota"
    ]),
    0,
    100000000
  );

  out.jumlahLembarNota = notaKasirClamp_(
    notaKasirGetValue_(input, "jumlahLembarNota", base.jumlahLembarNota, [
      "jumlahLembar",
      "lembarNota"
    ]),
    0,
    100000000
  );

  out.notaPerTransaksi = notaKasirClamp_(
    notaKasirGetValue_(input, "notaPerTransaksi", base.notaPerTransaksi, [
      "lembarPerTransaksi"
    ]),
    0,
    100000000
  );

  out.createdAt = notaKasirGetValue_(input, "createdAt", base.createdAt);
  out.updatedAt = notaKasirGetValue_(input, "updatedAt", base.updatedAt);

  return out;
}

function validateBiayaNotaKasir_(data) {
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      message: "Data nota/kasir tidak valid."
    };
  }

  if (!data.cabangId) {
    return {
      valid: false,
      message: "Cabang belum ditentukan."
    };
  }

  if (!["aplikasi_kasir_thermal", "nota_manual_ncr"].includes(data.sistemNotaKasir)) {
    return {
      valid: false,
      message: "Sistem nota/kasir tidak valid."
    };
  }

  if (
    data.sistemNotaKasir === "aplikasi_kasir_thermal" &&
    ![
      "biaya_langsung_per_transaksi",
      "biaya_bulanan_dibagi_transaksi",
      "gratis_tanpa_biaya_admin"
    ].includes(data.metodeBiayaAplikasi)
  ) {
    return {
      valid: false,
      message: "Metode biaya aplikasi tidak valid."
    };
  }

  return {
    valid: true,
    message: ""
  };
}

// ============================================================================
// SECTION: KALKULASI
// ============================================================================

function computeBiayaNotaKasirSummary_(record) {
  record = record || defaultBiayaNotaKasirRecord_("");

  const sistem = record.sistemNotaKasir || "aplikasi_kasir_thermal";
  const metode = record.metodeBiayaAplikasi || "biaya_langsung_per_transaksi";

  let biayaAplikasiPerLoad = 0;
  let biayaNotaPerLoad = 0;
  let hargaNotaPerLembar = 0;
  let biayaNotaPerTransaksi = 0;
  let totalBiayaNotaKasirPerLoad = 0;
  let warning = "";
  let statusValid = true;

  if (sistem === "aplikasi_kasir_thermal") {
    if (metode === "biaya_langsung_per_transaksi") {
      biayaAplikasiPerLoad = notaKasirRound2_(record.biayaPerTransaksi);
    } else if (metode === "biaya_bulanan_dibagi_transaksi") {
      const biayaBulanan = notaKasirToNumber_(record.biayaBulananAplikasi, 0);
      const trxBulanan = notaKasirToNumber_(record.estimasiTransaksiPerBulan, 0);

      if (trxBulanan > 0) {
        biayaAplikasiPerLoad = notaKasirRound2_(biayaBulanan / trxBulanan);
      } else {
        biayaAplikasiPerLoad = 0;
        warning = "Estimasi transaksi bulanan harus diisi lebih dari 0 untuk menghitung biaya aplikasi.";
        statusValid = false;
      }
    } else if (metode === "gratis_tanpa_biaya_admin") {
      biayaAplikasiPerLoad = 0;
    }

    const hargaRoll = notaKasirToNumber_(record.hargaPerRoll, 0);
    const transaksiRoll = notaKasirToNumber_(record.transaksiPerRoll, 0);

    if (transaksiRoll > 0) {
      biayaNotaPerLoad = notaKasirRound2_(hargaRoll / transaksiRoll);
    } else {
      biayaNotaPerLoad = 0;

      if (!warning) {
        warning = "Transaksi per roll harus diisi lebih dari 0 untuk menghitung biaya nota thermal.";
      }

      statusValid = false;
    }

    hargaNotaPerLembar = 0;
    biayaNotaPerTransaksi = biayaNotaPerLoad;
    totalBiayaNotaKasirPerLoad = notaKasirRound2_(biayaAplikasiPerLoad + biayaNotaPerLoad);
  }

  if (sistem === "nota_manual_ncr") {
    const hargaAwal = notaKasirToNumber_(record.hargaSatuanAwalNota, 0);
    const jumlahLembar = notaKasirToNumber_(record.jumlahLembarNota, 0);
    const notaPerTransaksi = notaKasirToNumber_(record.notaPerTransaksi, 0);

    if (jumlahLembar > 0) {
      hargaNotaPerLembar = notaKasirRound2_(hargaAwal / jumlahLembar);
    } else {
      hargaNotaPerLembar = 0;
      warning = "Jumlah lembar nota harus diisi lebih dari 0 untuk menghitung harga per lembar.";
      statusValid = false;
    }

    if (notaPerTransaksi > 0) {
      biayaNotaPerTransaksi = notaKasirRound2_(hargaNotaPerLembar * notaPerTransaksi);
    } else {
      biayaNotaPerTransaksi = 0;

      if (!warning) {
        warning = "Nota per transaksi harus diisi lebih dari 0 untuk menghitung biaya nota.";
      }

      statusValid = false;
    }

    biayaAplikasiPerLoad = 0;
    biayaNotaPerLoad = biayaNotaPerTransaksi;
    totalBiayaNotaKasirPerLoad = biayaNotaPerTransaksi;
  }

  return {
    sistemNotaKasir: sistem,
    metodeBiayaAplikasi: metode,
    biayaAplikasiPerLoad: notaKasirRound2_(biayaAplikasiPerLoad),
    biayaNotaPerLoad: notaKasirRound2_(biayaNotaPerLoad),
    hargaNotaPerLembar: notaKasirRound2_(hargaNotaPerLembar),
    biayaNotaPerTransaksi: notaKasirRound2_(biayaNotaPerTransaksi),
    totalBiayaNotaKasirPerLoad: notaKasirRound2_(totalBiayaNotaKasirPerLoad),
    statusValid: statusValid,
    warning: warning
  };
}

// ============================================================================
// SECTION: PUBLIC FUNCTIONS
// ============================================================================

function getBiayaNotaKasir(cabangId) {
  try {
    if (!cabangId || typeof cabangId !== "string") {
      return {
        ok: false,
        error: "ID cabang tidak valid.",
        stage: "getBiayaNotaKasir:validate_cabang_id"
      };
    }

    if (typeof ensureMigrated_ === "function") {
      try {
        ensureMigrated_();
      } catch (e) {
        console.warn("[NotaKasir] ensureMigrated_ gagal, melanjutkan tanpa migrasi:", e);
      }
    }

    const cabang = getCabangInfoNotaKasir_(cabangId);
    const sheet = getBiayaNotaKasirSheet_();
    const rowIndex = findBiayaNotaKasirRowFast_(sheet, cabangId);

    let record;

    if (rowIndex > 0) {
      const values = sheet
        .getRange(rowIndex, 1, 1, BIAYA_NOTA_KASIR_HEADERS_.length)
        .getValues()[0];

      const rowObject = rowArrayToBiayaNotaKasirObject_(values);
      record = normalizeBiayaNotaKasirRecord_(rowObject, cabangId);
    } else {
      record = defaultBiayaNotaKasirRecord_(cabangId);
    }

    return {
      ok: true,
      data: {
        cabang: {
          id: cabang.id,
          namaLaundry: cabang.namaLaundry
        },
        record: record,
        summary: computeBiayaNotaKasirSummary_(record)
      }
    };
  } catch (err) {
    return notaKasirErrorResponse_(err, "getBiayaNotaKasir");
  }
}

function saveBiayaNotaKasir(cabangId, payload) {
  try {
    if (!cabangId || typeof cabangId !== "string") {
      return {
        ok: false,
        error: "ID cabang tidak valid.",
        stage: "saveBiayaNotaKasir:validate_cabang_id"
      };
    }

    if (!payload || typeof payload !== "object") {
      return {
        ok: false,
        error: "Data yang dikirim tidak valid.",
        stage: "saveBiayaNotaKasir:validate_payload"
      };
    }

    const sheet = getBiayaNotaKasirSheet_();
    const rowIndex = findBiayaNotaKasirRowFast_(sheet, cabangId);

    let existingRecord = null;

    if (rowIndex > 0) {
      const existingValues = sheet
        .getRange(rowIndex, 1, 1, BIAYA_NOTA_KASIR_HEADERS_.length)
        .getValues()[0];

      existingRecord = normalizeBiayaNotaKasirRecord_(
        rowArrayToBiayaNotaKasirObject_(existingValues),
        cabangId
      );
    }

    const normalized = normalizeBiayaNotaKasirRecord_(payload, cabangId);

    normalized.id =
      existingRecord && existingRecord.id
        ? existingRecord.id
        : normalized.id || notaKasirNewId_("n");

    const now = new Date().toISOString();

    normalized.createdAt =
      existingRecord && existingRecord.createdAt
        ? existingRecord.createdAt
        : now;

    normalized.updatedAt = now;

    const validation = validateBiayaNotaKasir_(normalized);

    if (!validation.valid) {
      return {
        ok: false,
        error: validation.message,
        stage: "saveBiayaNotaKasir:validate_business_rules"
      };
    }

    const row = buildBiayaNotaKasirRow_(normalized);

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return {
      ok: true,
      data: {
        record: normalized,
        summary: computeBiayaNotaKasirSummary_(normalized)
      }
    };
  } catch (err) {
    return notaKasirErrorResponse_(err, "saveBiayaNotaKasir");
  }
}

// ============================================================================
// SECTION: TEST MANUAL
// ============================================================================

function testBiayaNotaKasir() {
  const cabangId = "test-cabang";

  const payload = {
    sistemNotaKasir: "aplikasi_kasir_thermal",
    metodeBiayaAplikasi: "biaya_langsung_per_transaksi",
    biayaPerTransaksi: 155,
    biayaBulananAplikasi: 0,
    estimasiTransaksiPerBulan: 0,
    hargaPerRoll: 1500,
    transaksiPerRoll: 30,
    hargaSatuanAwalNota: 30000,
    jumlahLembarNota: 150,
    notaPerTransaksi: 3
  };

  const hasil = saveBiayaNotaKasir(cabangId, payload);
  Logger.log(JSON.stringify(hasil, null, 2));
  return hasil;
}

// Fungsi dummy agar kalau dropdown masih memilih myFunction, tidak error.
function myFunction() {
  return testBiayaNotaKasir();
}