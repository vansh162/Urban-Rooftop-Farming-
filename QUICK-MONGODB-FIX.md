# ⚡ Quick MongoDB Setup

## 🎯 Problem
- MongoDB Atlas connection failing (DNS resolution issue)
- MongoDB not installed locally

## ✅ Solution: Install Local MongoDB

### Step 1: Download & Install

1. **Download MongoDB Community Server:**
   - Direct link: https://www.mongodb.com/try/download/community
   - Select: **Windows** → **MSI** → **Download**

2. **Run Installer:**
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (optional GUI)
   - Click **Install**

3. **Verify Installation:**
   ```powershell
   Get-Service MongoDB
   ```
   Should show: **Running**

### Step 2: Update `.env` File

Change line 3 in `server/.env`:

**From:**
```env
MONGODB_URI=mongodb+srv://vanshthakkar1622005_db_user:WuSyaOIlBKf6MvQv@cluster0.yitkv1l.mongodb.net/leafinity?retryWrites=true&w=majority
```

**To:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/leafinity
```

### Step 3: Restart Server

Your server will automatically restart (nodemon watches for changes).

You should see:
```
✅ MongoDB connected successfully
🚀 Leafinity API running on http://localhost:5000
```

---

## 🔍 Why Atlas Connection Fails

The error `querySrv ECONNREFUSED` means DNS can't resolve the cluster hostname. This could be:
- VPN/Proxy blocking DNS queries
- Firewall blocking SRV record lookups
- Network DNS server issues
- Corporate network restrictions

**Local MongoDB avoids all these issues!**

---

## 📝 Alternative: Fix Atlas Connection

If you must use Atlas:

1. **Check if cluster is paused:**
   - Go to MongoDB Atlas Dashboard
   - Check if cluster shows "Paused" - if so, click "Resume"

2. **Try different DNS:**
   - Use Google DNS: `8.8.8.8` and `8.8.4.4`
   - Or Cloudflare DNS: `1.1.1.1`

3. **Check VPN/Proxy:**
   - Disable VPN temporarily to test
   - Check proxy settings

4. **Use IP instead of hostname** (not recommended, but works):
   - Get cluster IP from Atlas dashboard
   - Use standard connection string format

---

## 💡 Recommendation

**For development, use local MongoDB** - it's faster, more reliable, and works offline!
