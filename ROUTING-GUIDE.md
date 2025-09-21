# JobScooter Routing & File Structure Guide

## 🚀 Current File Organization Problem

You're getting a **403 Forbidden** error because the web server can't find the HTML files in the right location. Let's fix this!

## 📁 Correct File Structure

```
/public_html/                          ← Main web directory (what users see)
├── index.html                         ← Landing page (MUST BE HERE)
├── pre-application.html               ← Pre-app page (MUST BE HERE)  
├── status.html                        ← Status check page
├── .htaccess                          ← Web server config
├── css/                               ← Stylesheets directory
│   ├── styles.css                     ← Main styles
│   └── application.css                ← Application styles
├── js/                                ← JavaScript directory  
│   ├── main.js                        ← Main JavaScript
│   └── pre-application.js             ← Pre-app JavaScript
└── jobscooter/                        ← Node.js application (backend)
    ├── server.js                      ← Express server
    ├── .env                           ← Environment config
    ├── package.json                   ← Dependencies
    ├── routes/                        ← API routes
    ├── services/                      ← Services (email, etc.)
    └── config/                        ← Database config
```

## 🔧 Quick Fix Commands

Run these commands to organize your files correctly:

```bash
# Navigate to your jobscooter directory
cd /home/jobscootercoz614/domains/jobscooter.co.za/public_html/jobscooter

# Run the file organization script
npm run organize

# Restart your server
npm start
```

## 🌐 How Web Routing Works

### **Static Files (HTML/CSS/JS)**
- **Web Server** (Apache/Nginx) serves these directly from `/public_html/`
- Users visit `jobscooter.co.za` → Web server looks for `/public_html/index.html`
- Users visit `jobscooter.co.za/css/styles.css` → Web server looks for `/public_html/css/styles.css`

### **API Calls** 
- **Node.js Server** running on port 3000 handles API routes
- `.htaccess` file proxies API calls: `/api/*` → `http://localhost:3000/api/*`
- Users call `jobscooter.co.za/api/landing/info` → Gets proxied to Node.js

## ⚡ Updated Server Configuration

Your server.js now includes smart path detection:

```javascript
// Tries multiple locations for files
app.get('/', (req, res) => {
  const possiblePaths = [
    path.join(__dirname, '..', 'index.html'),      // Parent directory ✅
    path.join(__dirname, 'public', 'index.html'),  // Public subfolder
    path.join(__dirname, 'index.html')             // Same directory
  ];
  
  // Serves the first file it finds
});
```

## 📊 File Location Priority

### **For index.html:**
1. `/public_html/index.html` ← **MAIN LOCATION** (web server)
2. `/public_html/jobscooter/../index.html` ← **BACKUP** (Node.js fallback)
3. `/public_html/jobscooter/public/index.html` ← **DEV LOCATION**

### **For CSS/JS:**
1. `/public_html/css/styles.css` ← **MAIN LOCATION**
2. `/public_html/js/main.js` ← **MAIN LOCATION**  

## 🔍 Troubleshooting Steps

### **1. Check File Locations**
```bash
ls -la /home/jobscootercoz614/domains/jobscooter.co.za/public_html/
# Should show: index.html, css/, js/, jobscooter/
```

### **2. Test Static File Serving**
- Visit: `https://www.jobscooter.co.za/index.html`
- Visit: `https://www.jobscooter.co.za/css/styles.css`
- Visit: `https://www.jobscooter.co.za/status.html`

### **3. Test API Routing**  
- Visit: `https://www.jobscooter.co.za/api/landing/info`
- Should return JSON data from Node.js server

### **4. Check Server Status**
```bash
# Is Node.js running?
ps aux | grep node

# Check server logs
tail -f /var/log/jobscooter.log
```

## 🚨 Common Issues & Solutions

### **Issue: 403 Forbidden**
**Cause:** HTML files not in `/public_html/` root
**Solution:** Run `npm run organize` to copy files correctly

### **Issue: CSS/JS Not Loading**
**Cause:** Assets in wrong directory
**Solution:** Ensure files are in `/public_html/css/` and `/public_html/js/`

### **Issue: API Calls Failing**
**Cause:** Node.js server not running or .htaccess proxy not working
**Solution:** 
1. Start Node.js: `npm start`
2. Check .htaccess file exists in `/public_html/`

### **Issue: Server Shows File Paths**
**Cause:** This is actually helpful! It shows which paths the server is trying
**Solution:** Use the debug info to verify file locations

## ✅ Verification Checklist

- [ ] `index.html` exists in `/public_html/`
- [ ] `css/styles.css` exists in `/public_html/css/`
- [ ] `js/main.js` exists in `/public_html/js/`  
- [ ] `.htaccess` exists in `/public_html/`
- [ ] Node.js server running on port 3000
- [ ] Database connection working
- [ ] Can access `jobscooter.co.za` without errors

## 🎯 Quick Test URLs

Once files are organized correctly, test these:

- **Main site:** https://www.jobscooter.co.za
- **Pre-app:** https://www.jobscooter.co.za/pre-application.html
- **Status:** https://www.jobscooter.co.za/status.html
- **API:** https://www.jobscooter.co.za/api/landing/info
- **CSS:** https://www.jobscooter.co.za/css/styles.css

## 🎉 Success Indicators

When everything works correctly:
- ✅ Landing page loads with JobScooter branding
- ✅ "Apply Now" button functionality works
- ✅ Smooth animations and professional styling
- ✅ API calls return JSON data
- ✅ No 403/404 errors

---

**TL;DR:** Run `npm run organize` to fix file paths, then `npm start` to run the server!