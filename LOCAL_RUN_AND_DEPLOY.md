# How to Run & Deploy Your React Project

## 1. How to Run Locally (On Your Laptop)

### Prerequisites
You need **Node.js** installed on your computer.
1. Download and install Node.js from: https://nodejs.org/
2. Open your terminal (Command Prompt on Windows, Terminal on Mac).
3. Check if installed by typing: `node -v`

### Steps to Run
1. **Download:** Download the project zip file from Replit.
2. **Extract:** Unzip the folder to a location (e.g., `Desktop/galoya-site`).
3. **Open Terminal:** Navigate to the folder in your terminal:
   ```bash
   cd Desktop/galoya-site
   ```
4. **Install Dependencies:** Run this command to download the libraries:
   ```bash
   npm install
   ```
5. **Start Server:** Run the development server:
   ```bash
   npm run dev
   ```
6. **View Site:** Open your browser and go to `http://localhost:5000` (or the port shown in the terminal).

---

## 2. How to Deploy (Put it on the Internet)

This is a **Static Site**, which makes it free and easy to host.

### Option A: Netlify / Vercel (Recommended - Easiest)
1. Create a free account on [Netlify](https://netlify.com) or [Vercel](https://vercel.com).
2. Drag and drop your project folder (or connect your GitHub repository).
3. **Build Settings:**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/public` (or just `dist` depending on your vite config)
4. Click Deploy. It will be online in seconds with a free URL (e.g., `galoya-arrack.netlify.app`).

### Option B: Traditional Hosting (cPanel / FTP)
If you have a shared hosting plan (like Bluehost, GoDaddy, HostGator):
1. In your project terminal, run:
   ```bash
   npm run build
   ```
2. This creates a `dist` folder.
3. Open that `dist` folder. You will see `index.html`, `assets/`, etc.
4. Upload **the contents** of the `dist` folder to your server's `public_html` folder using an FTP client (like FileZilla).

---

## 3. Creating an Admin Panel

**Current Status:**
Right now, this is a **Static Website**.
- Data (Products, Portfolio) is stored in code files (`client/src/data/`).
- To update content, you must edit the code and re-deploy.

**To Have an Admin Panel:**
You need to upgrade this project to a **Full-Stack Application**.
This involves:
1. **Database:** Storing your portfolio items in a database (like PostgreSQL) instead of a text file.
2. **Backend API:** A server to read/write to that database.
3. **Admin Page:** A private login area where you can fill out forms to add/edit items.
4. **Authentication:** A secure login system so only you can access the admin panel.

**Recommendation:**
If you want to update the site frequently without coding, ask the AI to "Upgrade to a full-stack app with an admin panel".
