# Quick Test Guide: Air Feature

## Before You Test
- Save and deploy the code to Google Apps Script
- Refresh the browser tab

## Test Scenario 1: PDAM/Meteran

1. Open the app and navigate to **Master Biaya**
2. Click **Air** pill
3. Select any branch
4. Water source should default to **PDAM/Meteran**
5. Enter:
   - Harga air per m³: **3000**
   - Kebutuhan air per load: **200**
6. Should see **Rp600** (= 3000 × 200 / 1000)
7. Click **Simpan perubahan**
8. Should see success message
9. Navigate away and back → data should reload

## Test Scenario 2: Tangki/Toren

1. Same branch or different one
2. Click **Air** pill → select branch
3. Click **Tangki/Toren** button
4. Enter:
   - Harga per tangki: **50000**
   - Kapasitas tangki: **1000** (liters)
   - Kebutuhan air per load: **200** (liters)
5. Should see **Rp10,000** (= (50000 / 1000) × 200)
6. Save and verify persistence

## Test Scenario 3: Sumur Bor

1. Same branch
2. Click **Air** pill → select branch
3. Click **Sumur Bor** button
4. Should see:
   - No input fields
   - **Rp0** as biaya
   - Info message: "Biaya air ditetapkan Rp0. Beban operasional sumur sudah dihitung otomatis pada konsumsi listrik Pompa Air di Tab Listrik."
5. Click **Simpan perubahan**
6. Should save without error

## Test Scenario 4: Validation

1. Try to save PDAM with:
   - Empty harga → **Error: "Harga per m³ PDAM harus lebih dari 0."**
   - Zero kebutuhan → **Error: "Kebutuhan air per load harus lebih dari 0."**
2. Try to save Tangki with:
   - Empty harga, kapasitas, or kebutuhan → appropriate error
3. Sumur → no validation, always saves

## Test Scenario 5: Cascade Delete

1. Create air config for a branch
2. Go to **Cabang & Lokasi**
3. Delete that branch
4. Go back to **Master Biaya** → **Air**
5. Select another branch (verify its data is intact)
6. Try to select the deleted branch → should fail gracefully
7. Deleted branch's air data is gone

## Test Scenario 6: Multiple Branches

1. Set Air PDAM config for Branch A
2. Switch to Air Tangki config for Branch B
3. Switch back to Branch A → should show PDAM config
4. Switch back to Branch B → should show Tangki config
5. Verify each branch's data is independent

## Expected Behavior

✅ Air pill is **active and clickable** (not disabled)
✅ Three water sources are selectable
✅ Correct calculation formula for each source
✅ Real-time preview as you type
✅ Values can't go negative
✅ Proper Rupiah formatting (Rp)
✅ Data persists after save
✅ Clear error messages on validation failure
✅ Info message shows for Sumur only
✅ No "per Kg" label anywhere (only "per load")

## What NOT to Do

❌ Don't try to input text in number fields
❌ Don't expect per-kg pricing (only per-load)
❌ Don't expect Sumur to have input fields
❌ Don't expect deleted data to appear again
