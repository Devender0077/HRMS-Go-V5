# 🚀 Digital Contract Management - Quick Start Guide

## ⚡ **Get Started in 5 Minutes!**

---

## 📋 Prerequisites

- ✅ HRMS Go V5 already running
- ✅ MySQL database running (Docker or local)
- ✅ Node.js installed
- ✅ Backend on port 8000
- ✅ Frontend on port 3000

---

## 🎯 Quick Deploy (Automated)

### **Option 1: One Command Deploy**
```bash
./deploy-contract-system.sh
```

This will:
- ✅ Check/create .env file
- ✅ Install all dependencies
- ✅ Run database migration
- ✅ Create 8 tables
- ✅ Insert 14 sample templates
- ✅ Configure everything

---

## 🔧 Manual Deploy (Step by Step)

### **Step 1: Run Database Migration** (2 minutes)
```bash
cd backend

# If using Docker:
docker exec -i $(docker ps -q -f name=mysql) mysql -u root -p{password} hrms_go_v5 < database/contract_management_schema.sql

# If using local MySQL:
mysql -u root -p hrms_go_v5 < database/contract_management_schema.sql
```

**Verify:**
```sql
SELECT COUNT(*) FROM contract_templates;  -- Should show 14
```

---

### **Step 2: Configure Email** (1 minute)

Edit `backend/.env` and add:
```env
# Email for sending contracts
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password  # NOT your regular password!
EMAIL_FROM=noreply@yourcompany.com
COMPANY_NAME=Your Company Name

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Contract automation
AUTO_SEND_ONBOARDING=false  # Set true to auto-send on employee creation
ENABLE_CONTRACT_CRON=true    # Enable scheduled reminders
```

**Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Generate App Password
4. Use that password in .env

---

### **Step 3: Restart Backend** (30 seconds)
```bash
cd backend
# Stop current server (Ctrl+C)
npm start
```

**Look for these messages:**
```
✅ Database ready (58 models registered)
✅ Contract management model associations set up
🕐 Starting contract management cron jobs...
✅ Contract cron jobs started
   - Reminder job: Daily at 9 AM
   - Expiry job: Daily at midnight
   - Overdue job: Daily at 8 AM
✅ Server running on port 8000
```

---

### **Step 4: Refresh Frontend** (10 seconds)
```
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

## ✅ **DONE! System is Ready!**

---

## 🧪 Quick Test

### **Test 1: View Templates** (30 seconds)
1. Go to `http://localhost:3000/dashboard/contracts/templates`
2. You should see 14 templates grouped by region:
   - 🇺🇸 USA (5 templates)
   - 🇮🇳 India (5 templates)
   - 🌍 Global/Vendor (4 templates)

---

### **Test 2: Send a Contract** (2 minutes)
1. Go to `http://localhost:3000/dashboard/contracts/send`
2. Select template: "Employment Agreement - USA"
3. Select employee: Any employee from dropdown
4. Email auto-fills
5. Click "Create & Send Contract"
6. ✅ Contract created!
7. If you click "Send Now" → Email sent to employee

---

### **Test 3: Auto-Onboarding** (3 minutes)
1. Go to `http://localhost:3000/dashboard/hr/employees/new`
2. Fill employee form
3. **Important:** Set region to "usa" or "india"
4. Submit
5. Check backend logs:
   ```
   📋 Auto-creating onboarding checklist...
   ✅ Created 5 onboarding documents
   ```
6. Login as that employee
7. Go to `http://localhost:3000/dashboard/onboarding`
8. ✅ See 5 pending documents!

---

### **Test 4: Sign a Contract** (2 minutes)
1. As employee, go to `/dashboard/onboarding`
2. Click "Sign Now" on any document
3. Fill your name
4. Draw or type signature (switch tabs to try both)
5. Check the agreement checkbox
6. Click "Sign & Complete"
7. ✅ Contract completed!
8. Check email for completion notification

---

### **Test 5: View Analytics** (1 minute)
```bash
# Get analytics
curl -H "Authorization: Bearer {your-token}" \
  http://localhost:8000/api/contract-analytics/analytics

# Get onboarding report
curl -H "Authorization: Bearer {your-token}" \
  http://localhost:8000/api/contract-analytics/onboarding-report
```

---

## 🎯 Common Use Cases

### **Use Case 1: Onboard New USA Employee**
1. HR creates employee with region "usa"
2. System auto-creates 5 documents:
   - Employment Agreement
   - Form I-9
   - Form W-4
   - NDA
   - Direct Deposit Authorization
3. Employee receives email (if AUTO_SEND_ONBOARDING=true)
4. Employee signs all 5 documents
5. HR gets notification
6. ✅ Onboarding complete!

---

### **Use Case 2: Send Vendor MSA**
1. Go to `/dashboard/contracts/send`
2. Select "Master Service Agreement (MSA)"
3. Change recipient type to "Vendor"
4. Enter vendor name and email
5. Set expiry (e.g., 14 days)
6. Send
7. Vendor receives email
8. Vendor signs online
9. ✅ MSA completed!

---

### **Use Case 3: Manage Templates**
1. Go to `/dashboard/contracts/templates`
2. Upload new PDF template
3. Click "Edit Fields" to add signing fields
4. Activate template
5. Use template to send contracts
6. Duplicate for variations
7. Track usage in analytics

---

## 🐛 Troubleshooting

### **Problem: Tables not created**
```bash
# Manually run migration
cd backend
docker exec -i $(docker ps -q -f name=mysql) \
  mysql -u root -p{password} hrms_go_v5 \
  < database/contract_management_schema.sql
```

---

### **Problem: Emails not sending**
**Check:**
1. .env has correct email credentials
2. Using Gmail App Password (not regular password)
3. Backend logs show email errors
4. Test SMTP connection

**Fix for Gmail:**
- Enable 2-Step Verification
- Generate App Password
- Use App Password in .env

---

### **Problem: Onboarding docs not auto-created**
**Check:**
1. Employee has region field set (usa/india)
2. Templates exist and are active
3. Backend logs show:
   ```
   📋 Auto-creating onboarding checklist...
   ✅ Created 5 onboarding documents
   ```

**Fix:**
- Verify templates exist: `SELECT * FROM contract_templates WHERE region = 'usa';`
- Check backend logs for errors
- Try manual creation: POST /api/employee-onboarding-documents/create-checklist

---

### **Problem: Cron jobs not running**
**Check:**
```
# Backend should show:
🕐 Starting contract management cron jobs...
✅ Contract cron jobs started
```

**Fix:**
- Set `ENABLE_CONTRACT_CRON=true` in .env
- Restart backend

---

## 📚 Documentation

### **Complete Guides:**
1. **ALL_PHASES_COMPLETE.md** - Complete system overview
2. **PHASE_1_COMPLETE.md** - Foundation details
3. **CONTRACT_MANAGEMENT_SYSTEM_PLAN.md** - Original plan
4. **This file** - Quick start guide

### **API Documentation:**
All endpoints documented in `ALL_PHASES_COMPLETE.md`

---

## 🎉 Success Checklist

After deployment, verify:
- [ ] Database has 8 new tables
- [ ] 14 templates visible in UI
- [ ] Can send contract to employee
- [ ] Employee can sign contract
- [ ] Emails are being sent
- [ ] Onboarding checklist auto-creates
- [ ] Analytics show data
- [ ] Audit trail logging works

---

## 💡 Pro Tips

1. **Start with AUTO_SEND_ONBOARDING=false**
   - Test manually first
   - Enable auto-send after testing

2. **Test email in development**
   - Use a test email first
   - Verify formatting looks good
   - Check spam folder

3. **Use real templates**
   - Replace sample templates with your actual PDFs
   - Add your branding
   - Customize field positions

4. **Monitor cron jobs**
   - Check backend logs daily
   - Verify reminders are sent
   - Monitor expiry job

5. **Backup audit trail**
   - Audit logs are critical for compliance
   - Never delete audit_log table
   - Regular backups recommended

---

## 🚀 You're Ready to Go!

**Your HRMS now has:**
- ✅ DocuSign-like functionality
- ✅ $0 cost (vs $15-30/user/month)
- ✅ Full control & customization
- ✅ Complete integration with your HRMS

**Start onboarding employees digitally today!** 🎉

---

Need help? Check:
- ALL_PHASES_COMPLETE.md for detailed docs
- Backend logs for troubleshooting
- GitHub issues for support

