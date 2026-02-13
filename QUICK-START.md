# ⚡ Quick Start Guide

## 🚨 PowerShell Execution Policy Issue?

If you see: `"running scripts is disabled on this system"`

### ✅ Solution 1: Use Command Prompt (Easiest!)
1. Open **Command Prompt** (not PowerShell)
2. Navigate to project: `cd C:\Users\vansh\Desktop\urban\server`
3. Run: `npm run dev`
4. No policy issues!

### ✅ Solution 2: Use the Helper Scripts
Double-click these files:
- `server/start-dev.ps1` - Starts backend
- `client/start-dev.ps1` - Starts frontend

### ✅ Solution 3: Use the Batch File
Double-click `start-dev.bat` in project root (starts both servers)

### ✅ Solution 4: Manual PowerShell Fix
In PowerShell, run this **first**, then your npm command:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm run dev
```

---

## 🚀 Starting the Servers

### Option A: Batch File (Recommended)
```cmd
# Just double-click:
start-dev.bat
```

### Option B: Command Prompt (No Issues)
**Terminal 1 - Backend:**
```cmd
cd C:\Users\vansh\Desktop\urban\server
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd C:\Users\vansh\Desktop\urban\client
npm run dev
```

### Option C: PowerShell Scripts
**Terminal 1 - Backend:**
```powershell
cd C:\Users\vansh\Desktop\urban\server
.\start-dev.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\vansh\Desktop\urban\client
.\start-dev.ps1
```

---

## ✅ Verify It's Working

- **Backend**: http://localhost:5000/api/health
- **Frontend**: http://localhost:5173

You should see:
- Backend: `MongoDB connected` and `Leafinity API running on http://localhost:5000`
- Frontend: Opens in browser with the Hero section

---

## 🔧 Troubleshooting

**MongoDB Connection Error?**
- Check your `.env` file has correct MongoDB URI
- If using Atlas, ensure your IP is whitelisted
- Check internet connection

**Port Already in Use?**
- Backend: Change `PORT=5000` to another port in `server/.env`
- Frontend: Vite will auto-use next available port (5174, 5175, etc.)
