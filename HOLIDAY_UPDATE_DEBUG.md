# 🐛 Holiday Update Debugging Guide

**If holiday updates are not working, follow this debugging checklist**

---

## ✅ Step 1: Check Backend is Running

Open terminal and check:
```bash
lsof -i:8000
```

**If empty:** Backend is NOT running → Start it!
```bash
cd backend
npm start
```

---

## ✅ Step 2: Verify Migration Was Run

The multi-region feature requires a database migration!

**Run this in phpMyAdmin:**
```
backend/database/update_holidays_region_to_json.sql
```

This changes the `region` column from ENUM to VARCHAR(500) to support JSON arrays.

**How to verify it worked:**
```sql
-- In phpMyAdmin, run:
SHOW COLUMNS FROM holidays WHERE Field = 'region';

-- Should show:
-- Type: varchar(500)
-- NOT: enum('india','usa','global','other')
```

---

## ✅ Step 3: Check Browser Console for Errors

Open browser console (F12 or Cmd+Option+I) and look for:

### **When Clicking "Edit" Button:**
```
💾 [Holidays Form] Submitting: {
  isEdit: true,
  holidayId: 22,
  submitData: {...},
  selectedRegions: ['india', 'usa']
}
```

### **If You See:**
```
❌ [Holidays Form] Error: Data truncated for column 'region'
```
**Fix:** Migration wasn't run! Region column is still ENUM, not VARCHAR.

### **If You See:**
```
❌ [Holiday Service] Update error: 404 Not Found
```
**Fix:** Check backend route registration in server.js

### **If You See:**
```
❌ [Holiday Service] Update error: 500 Internal Server Error
```
**Fix:** Check backend logs for SQL errors

---

## ✅ Step 4: Check Backend Logs

Look at backend terminal for:

### **When Updating Holiday:**
```
📅 [Holidays] Updating holiday ID: 22
📅 [Holidays] Update data: { name: 'Test', region: ['india','usa'], ... }
📅 [Holidays] Region type: object Value: ['india','usa']
✅ [Holidays] Holiday updated successfully: 22
```

### **If You See:**
```
❌ [Holidays] Error updating holiday: Data truncated
```
**Fix:** Run the migration! Region column needs to be VARCHAR(500)

---

## ✅ Step 5: Test Update Workflow

1. **Go to:** http://localhost:3000/dashboard/settings/holidays

2. **Click "Edit" (pencil icon)** on any holiday

3. **In the dialog:**
   - Change the name
   - Select multiple regions using checkboxes
   - Click "Update"

4. **Expected Console Output:**
```javascript
// Frontend Console:
💾 [Holidays Form] Submitting: { isEdit: true, holidayId: 1, ... }
📝 [Holidays Form] Updating holiday ID: 1
🔄 [Holiday Service] Updating holiday: 1 with data: {...}
✅ [Holiday Service] Update response: { success: true, message: '...' }
✅ [Holidays Form] Response: { success: true, ... }

// Backend Console:
📅 [Holidays] Updating holiday ID: 1
📅 [Holidays] Update data: {...}
📅 [Holidays] Region type: object Value: ['india','usa']
✅ [Holidays] Holiday updated successfully: 1
```

---

## 🔧 Common Issues & Fixes

### **Issue 1: "Data truncated for column 'region'"**
**Cause:** Migration not run, region is still ENUM  
**Fix:** Run `update_holidays_region_to_json.sql` in phpMyAdmin

### **Issue 2: Update silently fails (no error, no success)**
**Cause:** Response handling issue  
**Fix:** Check console logs, verify response.success is true

### **Issue 3: Region chips don't update after saving**
**Cause:** Frontend cache, page not refreshing  
**Fix:** Hard refresh (Cmd+Shift+R) or `fetchHolidays()` is not being called

### **Issue 4: Multi-select dropdown shows old value**
**Cause:** `selectedRegions` state not being set from holiday data  
**Fix:** Verify `handleOpenDialog` sets `setSelectedRegions(regions)`

### **Issue 5: Backend returns 500 error**
**Cause:** SQL error, model issue  
**Fix:** Check backend logs for stack trace

---

## 📋 Quick Diagnostic Commands

```bash
# Check if backend is running
lsof -i:8000

# Check backend logs
tail -f backend.log

# Check database column type
mysql -u root -p hrms_go_v5 -e "SHOW COLUMNS FROM holidays WHERE Field = 'region';"

# Kill and restart backend
lsof -ti:8000 | xargs kill -9
cd backend && npm start

# Clear browser cache
# In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

---

## ✅ Verification Checklist

- [ ] Backend is running on port 8000
- [ ] Migration `update_holidays_region_to_json.sql` was run
- [ ] Region column type is VARCHAR(500), not ENUM
- [ ] Browser console shows detailed logs
- [ ] Backend console shows update logs
- [ ] Hard refresh was done (Cmd+Shift+R)
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## 🎯 If All Else Fails

**Restart Everything:**
```bash
# Kill all processes
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Run migrations
# (in phpMyAdmin: update_holidays_region_to_json.sql)

# Start backend
cd backend
npm start

# Start frontend
npm start

# Hard refresh browser
Cmd+Shift+R
```

---

**Most Common Fix:** Migration not run → Run `update_holidays_region_to_json.sql` 🚀

