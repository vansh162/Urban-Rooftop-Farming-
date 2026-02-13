# 🚀 How to Run Leafinity Project

## Prerequisites Checklist

Before starting, make sure you have:

- ✅ **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **MongoDB** installed and running locally OR MongoDB Atlas account

### Check if you have Node.js:
```powershell
node --version
npm --version
```

### Check if MongoDB is running (if using local MongoDB):
```powershell
# MongoDB should be running on default port 27017
# You can check in Task Manager or run:
mongod --version
```

---

## Step-by-Step Setup

### Step 1: Install Backend Dependencies

Open PowerShell/Terminal in the project root and run:

```powershell
cd server
npm install
```

This will install all server dependencies (Express, Mongoose, JWT, etc.)

### Step 2: Configure Backend Environment

1. Copy the example environment file:
   ```powershell
   # In PowerShell:
   Copy-Item .env.example .env
   
   # Or manually create a file named `.env` in the server folder
   ```

2. Edit the `.env` file in the `server` folder and update these values:

   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/leafinity
   JWT_SECRET=your_super_secret_random_string_here_min_32_chars
   ```

   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leafinity?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_random_string_here_min_32_chars
   ```

   **Quick JWT Secret Generator:**
   ```powershell
   # Run this in PowerShell to generate a random secret:
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

### Step 3: Install Frontend Dependencies

Open a **new** PowerShell/Terminal window and run:

```powershell
cd client
npm install
```

This will install all frontend dependencies (React, Tailwind, Redux, etc.)

### Step 4: Start MongoDB (If using local MongoDB)

If you're using local MongoDB, make sure it's running:

**Option A: MongoDB as a Windows Service (Recommended)**
- MongoDB usually runs automatically as a service
- Check Task Manager → Services → MongoDB

**Option B: Start MongoDB manually**
```powershell
# Navigate to MongoDB bin directory (adjust path):
cd "C:\Program Files\MongoDB\Server\7.0\bin"
.\mongod.exe
```

**Option C: Use MongoDB Atlas (Cloud)**
- No local installation needed!
- Just use your Atlas connection string in `.env`

### Step 5: Start the Backend Server

In the **first** PowerShell window (server directory):

```powershell
cd server
npm run dev
```

You should see:
```
MongoDB connected
Leafinity API running on http://localhost:5000
```

✅ Backend is now running on `http://localhost:5000`

### Step 6: Start the Frontend Server

In the **second** PowerShell window (client directory):

```powershell
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ Frontend is now running on `http://localhost:5173`

---

## 🎉 You're All Set!

1. **Frontend**: Open `http://localhost:5173` in your browser
2. **Backend API**: Available at `http://localhost:5000`
3. **API Health Check**: Visit `http://localhost:5000/api/health`

---

## Quick Test

### Test the Price Estimator API:

Open PowerShell and run:
```powershell
# Test the price estimator endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/booking/estimate" -Method POST -ContentType "application/json" -Body '{"rooftopSizeSqFt":500,"systemType":"hydro"}' | ConvertTo-Json
```

Expected response:
```json
{
  "success": true,
  "estimatedPriceINR": 125000,
  "breakdown": {
    "rooftopSizeSqFt": 500,
    "systemType": "hydro",
    "baseRatePerSqFt": 250,
    "basePrice": 125000,
    "discount": 0,
    "finalPrice": 125000
  }
}
```

---

## Troubleshooting

### ❌ "npm cannot be loaded because running scripts is disabled" (PowerShell Execution Policy)

This is a common Windows PowerShell security restriction. **Choose one solution:**

**Solution 1: Bypass for Current Session (Quick Fix)**
```powershell
# Run this in PowerShell before npm commands:
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm install
```

**Solution 2: Use Command Prompt Instead (Easiest)**
- Open **Command Prompt (cmd)** instead of PowerShell
- Navigate to your project: `cd C:\Users\vansh\Desktop\urban\server`
- Run: `npm install` (works without any policy changes)

**Solution 3: Change Execution Policy Permanently (For Development)**
```powershell
# Run PowerShell as Administrator, then:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
This allows locally created scripts to run. You'll need to restart PowerShell after this.

**Solution 4: Use the Batch File**
The `start-dev.bat` file uses `cmd` instead of PowerShell, so it bypasses this issue entirely!

---

### ❌ "MongoDB connection error"
- **Solution**: Make sure MongoDB is running (local) or check your Atlas connection string
- Check if port 27017 is available: `netstat -an | findstr 27017`

### ❌ "Port 5000 already in use"
- **Solution**: Change `PORT=5000` to another port (e.g., `PORT=5001`) in `server/.env`
- Update `CLIENT_ORIGIN` in `.env` if you change the port

### ❌ "Port 5173 already in use"
- **Solution**: Vite will automatically use the next available port (5174, 5175, etc.)

### ❌ "Cannot find module"
- **Solution**: Make sure you ran `npm install` in both `server` and `client` folders

### ❌ Frontend can't connect to backend
- **Solution**: Check that backend is running on port 5000
- Verify CORS settings in `server/src/app.js`
- Check `CLIENT_ORIGIN` in `server/.env` matches frontend URL

---

## Running Both Servers at Once (Windows)

You can create a batch file to start both servers:

**Create `start-dev.bat` in project root:**
```batch
@echo off
start "Leafinity Backend" cmd /k "cd server && npm run dev"
timeout /t 3
start "Leafinity Frontend" cmd /k "cd client && npm run dev"
```

Then just double-click `start-dev.bat` to start both servers!

---

## Next Steps

Once everything is running:
1. ✅ Visit `http://localhost:5173` to see the Hero section
2. ✅ Try accessing `/admin` route (will redirect if not logged in)
3. ✅ Test the price estimator API endpoint
4. ✅ Start building out authentication, product catalog, and booking features!
