# rollback_shared_into_index.ps1
# Tujuan:
# Menggabungkan kembali isi Script_Shared_Formatter/Helper/UI/Validator langsung ke Index.html.
# Baris include shared akan dihapus dari Index.html.
# File Script_Shared_*.html tidak dihapus otomatis.

$ErrorActionPreference = "Stop"

# Jalankan script ini dari root repo:
# C:\Users\user\Documents\Kalkulator-Laundry-Versi-002

if (!(Test-Path "Index.html")) {
  throw "Index.html tidak ditemukan. Jalankan script ini dari folder root repo Kalkulator-Laundry-Versi-002."
}

if (!(Test-Path ".claspignore")) {
  throw ".claspignore tidak ditemukan. Jalankan script ini dari folder root repo Kalkulator-Laundry-Versi-002."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

Copy-Item "Index.html" "Index.html.backup-before-shared-rollback-$timestamp" -Force
Copy-Item ".claspignore" ".claspignore.backup-before-shared-rollback-$timestamp" -Force

$index = Get-Content "Index.html" -Raw

$sharedBlock = @'
  /*
   * =========================================================================
   * SHARED FUNCTIONS — rollback gabung kembali ke Index.html
   * Sumber: Script_Shared_Helper / Formatter / UI / Validator
   * Urutan: Helper -> Formatter -> UI -> Validator
   * =========================================================================
   */

  function escapeHtml(value) {
    var div = document.createElement("div");
    div.textContent = (value == null) ? "" : String(value);
    return div.innerHTML;
  }

  function toNumber(value, fallback) {
    var num = Number(value);
    if (isFinite(num)) return num;
    return (fallback == null) ? 0 : fallback;
  }

  function round2(value) {
    var num = Number(value);
    if (!isFinite(num)) return 0;
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  function pad2(value) {
    var num = Number(value) || 0;
    return num < 10 ? "0" + num : String(num);
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function safeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function findById(rows, id) {
    return safeArray(rows).find(function (item) {
      return item && item.id === id;
    }) || null;
  }

  function cloneObject(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function formatRp(value) {
    var num = Number(value || 0);
    if (!isFinite(num)) num = 0;

    return "Rp " + num.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatRupiah(value) {
    return formatRp(value);
  }

  function money0(value) {
    var num = Number(value || 0);
    if (!isFinite(num)) num = 0;

    return "Rp " + num.toLocaleString("id-ID", {
      maximumFractionDigits: 0
    });
  }

  function formatRupiahTanpaDesimal(value) {
    return money0(value);
  }

  function formatNum(value, maxFractionDigits) {
    var digit = (maxFractionDigits == null) ? 1 : Number(maxFractionDigits);
    if (!isFinite(digit) || digit < 0) digit = 1;

    return round2(value).toLocaleString("id-ID", {
      maximumFractionDigits: digit
    });
  }

  function formatPercent(value, maxFractionDigits) {
    var digit = (maxFractionDigits == null) ? 2 : Number(maxFractionDigits);
    if (!isFinite(digit) || digit < 0) digit = 2;

    var num = Number(value || 0);
    if (!isFinite(num)) num = 0;

    return num.toLocaleString("id-ID", {
      maximumFractionDigits: digit
    }) + "%";
  }

  function showToast(message, kind) {
    var el = document.getElementById("toast");
    if (!el) return;

    el.textContent = message || "";
    el.className = "toast show" + (kind ? " " + kind : "");

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(function () {
      el.className = "toast";
    }, 3200);
  }

  function toast(message, kind) {
    showToast(message, kind);
  }

  function setSaveStatus(text, kind) {
    var el = document.getElementById("saveStatus");
    if (!el) return;

    el.textContent = text || "";
    el.className = "save-status" + (kind ? " " + kind : "");
  }

  function clearSaveStatus() {
    setSaveStatus("", "");
  }

  function handleBackendError(res, actionLabel) {
    var msg = (res && res.error) ? res.error : "Terjadi kesalahan tidak dikenal.";
    var stage = (res && res.stage) ? res.stage : "unknown_stage";
    var label = actionLabel || "memproses data";

    console.error("[Kalkulator Laundry] Gagal " + label + " (stage: " + stage + "): " + msg);
    showToast("Gagal " + label + ": " + msg, "err");
    setSaveStatus("Gagal", "err");
  }

  function isValidNumber(value) {
    return isFinite(Number(value));
  }

  function validateNumber(value, options) {
    var opt = safeObject(options);
    var num = Number(value);

    if (!isFinite(num)) {
      return { ok: false, value: 0, message: opt.message || "Input harus berupa angka." };
    }
    if (opt.min != null && num < Number(opt.min)) {
      return { ok: false, value: num, message: opt.minMessage || "Input tidak boleh lebih kecil dari " + opt.min + "." };
    }
    if (opt.max != null && num > Number(opt.max)) {
      return { ok: false, value: num, message: opt.maxMessage || "Input tidak boleh lebih besar dari " + opt.max + "." };
    }

    return { ok: true, value: num, message: "" };
  }

  function isValidId(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function validateId(value, label) {
    if (isValidId(value)) {
      return { ok: true, value: value.trim(), message: "" };
    }

    return {
      ok: false,
      value: "",
      message: (label || "ID") + " belum valid."
    };
  }

  function validateRequired(value, label) {
    var text = (value == null) ? "" : String(value).trim();
    if (text) return { ok: true, value: text, message: "" };

    return {
      ok: false,
      value: "",
      message: (label || "Input") + " wajib diisi."
    };
  }

'@

$includePattern = '(?m)^\s*<\?!=\s*include\(''Script_Shared_Formatter''\)\s*\?>\s*\r?\n\s*<\?!=\s*include\(''Script_Shared_Helper''\)\s*\?>\s*\r?\n\s*<\?!=\s*include\(''Script_Shared_UI''\)\s*\?>\s*\r?\n\s*<\?!=\s*include\(''Script_Shared_Validator''\)\s*\?>\s*\r?\n?'

if ($index -notmatch "include\('Script_Shared_Formatter'\)") {
  Write-Host "INFO: Include Script_Shared_Formatter tidak ditemukan. Mungkin Index.html sudah pernah di-rollback."
} else {
  $index = [regex]::Replace($index, $includePattern, $sharedBlock, 1)
}

# Fail-safe: kalau regex urutan lengkap gagal, hapus baris satu per satu dan sisipkan setelah <script>(function...
if ($index -match "include\('Script_Shared_Formatter'\)") {
  $index = $index -replace '(?m)^\s*<\?!=\s*include\(''Script_Shared_Formatter''\)\s*\?>\s*\r?\n?', ''
  $index = $index -replace '(?m)^\s*<\?!=\s*include\(''Script_Shared_Helper''\)\s*\?>\s*\r?\n?', ''
  $index = $index -replace '(?m)^\s*<\?!=\s*include\(''Script_Shared_UI''\)\s*\?>\s*\r?\n?', ''
  $index = $index -replace '(?m)^\s*<\?!=\s*include\(''Script_Shared_Validator''\)\s*\?>\s*\r?\n?', ''

  if ($index -notmatch "SHARED FUNCTIONS — rollback gabung kembali ke Index.html") {
    $index = $index -replace '(<script>\s*\r?\n\s*\(function\s*\(\)\s*\{\s*\r?\n\s*"use strict";\s*\r?\n)', ('$1' + "`r`n" + $sharedBlock)
  }
}

# Hapus fungsi getInputNumber versi shared jika ada konflik? Tidak disisipkan di block ini karena Index.html sudah punya getInputNumber sendiri.
# Dengan begitu tidak ada duplikasi getInputNumber dari Validator.

[System.IO.File]::WriteAllText(
  "Index.html",
  $index,
  (New-Object System.Text.UTF8Encoding($false))
)

# Update .claspignore: hapus whitelist 4 Script_Shared, pertahankan baris lain.
$clasp = Get-Content ".claspignore" -Raw
$clasp = $clasp -replace '(?m)^!Script_Shared_Formatter\.html\s*\r?\n?', ''
$clasp = $clasp -replace '(?m)^!Script_Shared_Fromatter\.html\s*\r?\n?', ''
$clasp = $clasp -replace '(?m)^!Script_Shared_Helper\.html\s*\r?\n?', ''
$clasp = $clasp -replace '(?m)^!Script_Shared_UI\.html\s*\r?\n?', ''
$clasp = $clasp -replace '(?m)^!Script_Shared_Validator\.html\s*\r?\n?', ''

[System.IO.File]::WriteAllText(
  ".claspignore",
  $clasp,
  (New-Object System.Text.UTF8Encoding($false))
)

Write-Host ""
Write-Host "Selesai rollback shared ke Index.html."
Write-Host "Backup dibuat:"
Write-Host " - Index.html.backup-before-shared-rollback-$timestamp"
Write-Host " - .claspignore.backup-before-shared-rollback-$timestamp"
Write-Host ""
Write-Host "Cek hasil:"
Write-Host "Select-String -Path Index.html -Pattern ""Script_Shared_|SHARED FUNCTIONS|function escapeHtml|function formatRp|function showToast"" -Context 2,2"
Write-Host "Select-String -Path .claspignore -Pattern ""Script_Shared"""
Write-Host ""
Write-Host "Lanjutkan:"
Write-Host "git diff -- Index.html .claspignore"
Write-Host "clasp push"
