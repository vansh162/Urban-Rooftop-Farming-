# PowerShell script to start the development server
# This bypasses execution policy for this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
npm run dev
