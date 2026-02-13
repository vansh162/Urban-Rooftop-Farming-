# 🔧 MongoDB Connection Setup Guide

## ❌ Current Error: `ECONNREFUSED`

This means your app can't connect to MongoDB Atlas. Here are solutions:

---

## ✅ Solution 1: Fix MongoDB Atlas Connection (Recommended)

### Step 1: Whitelist Your IP Address

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Click **"Network Access"** in the left sidebar
3. Click **"Add IP Address"**
4. Choose one:
   - **Option A**: Click **"Add Current IP Address"** (for your current location)
   - **Option B**: Click **"Allow Access from Anywhere"** and add `0.0.0.0/0` (less secure, but works everywhere)
5. Click **"Confirm"**

### Step 2: Verify Database User

1. Go to **"Database Access"** in Atlas
2. Make sure your user (`vanshthakkar1622005_db_user`) exists and has read/write permissions
3. If needed, create a new user with password

### Step 3: Get Correct Connection String

1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add database name: `...mongodb.net/leafinity?retryWrites=true&w=majority`

### Step 4: Update `.env` File

Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/leafinity?retryWrites=true&w=majority
```

---

## ✅ Solution 2: Use Local MongoDB (Alternative)

If you have MongoDB installed locally:

### Step 1: Start MongoDB Service

**Windows:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB if not running
Start-Service MongoDB
```

Or check **Task Manager** → **Services** → Look for "MongoDB"

### Step 2: Update `.env` File

Edit `server/.env`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/leafinity
```

### Step 3: Restart Server

The server will automatically reconnect.

---

## ✅ Solution 3: Install Local MongoDB (If Not Installed)

### Download MongoDB Community Server

1. Go to: https://www.mongodb.com/try/download/community
2. Download **Windows** version
3. Run installer (choose "Complete" installation)
4. Install as Windows Service (default option)

### Verify Installation

```powershell
mongod --version
```

### Start MongoDB

MongoDB should start automatically as a Windows service. If not:
```powershell
Start-Service MongoDB
```

### Update `.env`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/leafinity
```

---

## 🔍 Troubleshooting

### Check Internet Connection
```powershell
ping cluster0.yitkv1l.mongodb.net
```

### Test MongoDB Atlas Connection
Try connecting with MongoDB Compass:
1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Use your Atlas connection string
3. If Compass connects, the issue is with Node.js/network config

### Check Firewall/Antivirus
- Temporarily disable firewall/antivirus to test
- Add Node.js to firewall exceptions if needed

### DNS Issues
If you're behind a corporate firewall/VPN, try:
```env
# Use IP instead of hostname (not recommended, but works)
MONGODB_URI=mongodb+srv://user:pass@[IP_ADDRESS]/leafinity
```

---

## 🚀 Quick Test

After fixing the connection, restart your server. You should see:
```
✅ MongoDB connected successfully
Leafinity API running on http://localhost:5000
```

---

## 💡 Recommended Setup

For **development**, use **local MongoDB** (faster, no internet needed):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/leafinity
```

For **production**, use **MongoDB Atlas** (cloud, scalable):
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/leafinity?retryWrites=true&w=majority
```
