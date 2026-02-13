# 🍃 Install Local MongoDB (Recommended for Development)

## Why Use Local MongoDB?

- ✅ **Faster** - No network latency
- ✅ **More reliable** - No connection issues
- ✅ **Free** - No cloud costs
- ✅ **Works offline** - No internet needed
- ✅ **Better for development** - Instant restarts

---

## 🚀 Quick Install (Windows)

### Option 1: MongoDB Community Server (Recommended)

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - **Version**: Latest (7.0+)
     - **Platform**: Windows
     - **Package**: MSI
   - Click **Download**

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose **"Complete"** installation
   - ✅ Check **"Install MongoDB as a Service"**
   - ✅ Check **"Run service as Network Service user"**
   - ✅ Check **"Install MongoDB Compass"** (GUI tool - optional but helpful)
   - Click **Install**

3. **Verify Installation:**
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # Should show: Running
   ```

4. **Update `.env` file:**
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/leafinity
   ```

5. **Restart your server** - It should connect immediately! 🎉

---

### Option 2: MongoDB via Chocolatey (If you have Chocolatey)

```powershell
# Install Chocolatey first (if not installed)
# Then run:
choco install mongodb -y

# Start MongoDB service
Start-Service MongoDB
```

---

## ✅ Verify It's Working

After installation, your server should show:
```
✅ MongoDB connected successfully
🚀 Leafinity API running on http://localhost:5000
```

---

## 🔧 Troubleshooting

### MongoDB Service Not Starting?

```powershell
# Check service status
Get-Service MongoDB

# Start manually
Start-Service MongoDB

# Check logs
Get-Content "C:\Program Files\MongoDB\Server\7.0\log\mongod.log" -Tail 20
```

### Port 27017 Already in Use?

```powershell
# Find what's using the port
netstat -ano | findstr :27017

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Can't Connect After Installation?

1. Check Windows Firewall - Allow MongoDB through firewall
2. Check antivirus - May need to whitelist MongoDB
3. Restart your computer after installation

---

## 📊 Using MongoDB Compass (GUI Tool)

After installation, you can use MongoDB Compass to:
- View databases and collections
- Insert/edit documents
- Run queries
- Monitor performance

**Connection String:**
```
mongodb://127.0.0.1:27017
```

---

## 🎯 Next Steps

Once MongoDB is installed and running:

1. ✅ Update `server/.env` with local connection string
2. ✅ Restart your server (`npm run dev`)
3. ✅ You should see "MongoDB connected successfully"
4. ✅ Start building your app!
