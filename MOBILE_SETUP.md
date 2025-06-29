# Mobile Development Setup

## 🚀 Quick Start for Mobile Testing

### Step 1: Start the Servers
```bash
# Terminal 1: Start the backend server
cd /home/anees/Desktop/Fevl/FevlManagement
npm run backend

# Terminal 2: Start the frontend for mobile access  
npm run start:mobile
```

### Step 2: Find Your IP Address
```bash
hostname -I | awk '{print $1}'
```
**Your current IP:** `192.168.0.159`

### Step 3: Access from Mobile
- **Main App:** `http://192.168.0.159:3000`
- **Debug Tool:** `http://192.168.0.159:3000/debug.html`
- **Backend API:** `http://192.168.0.159:8000`

## 🔧 Debugging Steps

If AI chat is not working on mobile, follow these steps:

### 1. Test Backend Connection
First, check if backend is accessible:
```bash
# From laptop terminal
curl http://192.168.0.159:8000/health
```
Should return: `{"status":"healthy"}`

### 2. Use the Debug Tool
Open on your mobile browser: `http://192.168.0.159:3000/debug.html`

This tool will automatically:
- ✅ Detect your connection
- ✅ Test backend connectivity  
- ✅ Test AI chat endpoint
- ✅ Show detailed error logs

### 3. Check Browser Console (Mobile)
On mobile browser:
- **Chrome:** Menu → More Tools → Developer Tools → Console
- **Safari:** Settings → Advanced → Web Inspector → Console
- **Firefox:** Menu → Developer Tools → Console

Look for error messages related to API calls.

## 📋 Common Issues & Solutions

### Issue 1: "Failed to fetch" or CORS errors
**Solution:** Make sure both servers are running and accessible
```bash
# Check if backend is running
lsof -i :8000

# Check if frontend is running  
lsof -i :3000
```

### Issue 2: Network timeout
**Solutions:**
1. Ensure mobile and laptop are on same Wi-Fi network
2. Disable VPN if active
3. Check firewall settings (allow ports 3000, 8000)

### Issue 3: API calls work on laptop but not mobile
**Solution:** The app automatically detects IP vs localhost. Check:
1. Browser console shows correct API base URL
2. Use debug tool to verify detection logic

## 🔍 Technical Details

### Auto-Detection Logic
```javascript
// The app automatically detects the environment:
const hostname = window.location.hostname;
if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // Mobile: Use same IP for API calls
    apiUrl = `http://${hostname}:8000`; 
} else {
    // Laptop: Use localhost
    apiUrl = 'http://localhost:8000';
}
```

### Server Configuration
- **Frontend:** Binds to `0.0.0.0:3000` (accessible from network)
- **Backend:** Binds to `0.0.0.0:8000` (accessible from network)
- **CORS:** Enabled for all origins in development mode
