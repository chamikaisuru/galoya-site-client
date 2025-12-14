# Galoya Arrack Website Project

This project is a static React application built for Galoya Arrack. It features a premium design, multilingual support (English, Sinhala, Tamil), and a responsive layout.

## 🚀 Deployment

### Replit
1. Click "Run" to start the development server.
2. The site is ready to serve.

### Netlify / Vercel
1. Build the project:
   ```bash
   npm run build
   ```
2. The output files will be in the `dist` folder.
3. Drag and drop the `dist` folder to Netlify Drop, or connect your Git repository.
4. Ensure your build command is `npm run build` and publish directory is `dist`.

## 📝 Editing Content

### Text & Translations
All text content is stored in JSON files for easy editing:
- **English:** `client/src/locales/en.json`
- **Sinhala:** `client/src/locales/si.json`
- **Tamil:** `client/src/locales/ta.json`

Edit these files to update text across the site. The structure is nested (e.g., `home.hero_title`).

### Products
Product data is located in:
- `client/src/data/products.ts`

To add a new product:
1. Add a new object to the `products` array.
2. Ensure you have an image for it.
3. The `id` must be unique and URL-friendly (e.g., `galoya-special`).

### Images
Images are currently stored in `attached_assets` and imported via the `@assets` alias.
To replace images:
1. Upload your new images to `client/src/assets` or `attached_assets`.
2. Update the import paths in the relevant component files (e.g., `client/src/pages/Home.tsx` for the hero image).

## 🔧 Features

- **Multilingual:** Language switcher in the navbar.
- **Responsive:** Mobile-first design with a drawer menu.
- **No E-commerce:** Informational only, as requested.
- **SEO Ready:** Sitemap and Robots.txt included.
- **Contact Form:** Static form ready for integration with Formspree or Netlify Forms.

## 📁 Portfolio & Gallery (New)

The gallery has been upgraded to a **Portfolio System**.

### Adding New CSR Events
1. Open `client/src/data/portfolio.ts`.
2. Add a new object to the `portfolioItems` array:
   ```typescript
   {
     id: "unique-id",
     slug: "url-friendly-slug",
     title: "Event Title",
     category: "csr", // or "plantation", "distillery", "bottle_shots"
     thumbnail: imageVariable,
     date: "Month Year",
     description: "Short description.",
     images: [image1, image2, image3] // Array of images for the slider
   }
   ```

### WordPress Migration Notes
The structure of `Portfolio.tsx` and `CSREvent.tsx` is designed to mirror WordPress custom post types:
- **Portfolio Archive:** `Portfolio.tsx` (Grid layout with filters).
- **Single Portfolio:** `CSREvent.tsx` (Detail layout with slider).

When moving to WordPress/Elementor:
1. Create a "Portfolio" Custom Post Type.
2. Use "ACF" (Advanced Custom Fields) for the Gallery/Slider images.
3. Use Elementor's "Post Grid" for the archive page.
4. Use Elementor's "Image Carousel" or "Basic Gallery" for the detail page slider.

## 📧 Contact Form Setup

To make the contact form functional:

**Option A: Netlify Forms**
The form already has `data-netlify="true"`. If deploying to Netlify, it should work automatically.

**Option B: Formspree**
1. Go to [Formspree](https://formspree.io).
2. Create a new form and get the endpoint URL.
3. Edit `client/src/components/ContactForm.tsx`:
   - Uncomment the fetch logic in the `onSubmit` function.
   - Replace `'https://formspree.io/f/your-id'` with your actual URL.

## 🎨 Styling

The site uses Tailwind CSS.
- **Theme Config:** `client/src/index.css` (Colors, Fonts).
- **Primary Color:** Gold (`hsl(46 65% 52%)`).
- **Background:** Dark (`hsl(240 5% 10%)`).

To change the primary color, edit the `--primary` variable in `client/src/index.css`.


##########################################################

# 📧 How to Get SMTP Settings for galoya.lk

## Method 1: cPanel (Most Common)

### Step 1: Login to cPanel
1. Go to your hosting cPanel (usually: `https://galoya.lk:2083`)
2. Login with your hosting credentials

### Step 2: Create Email Account
1. Find **"Email Accounts"** section
2. Click **"Create"**
3. Create email: `noreply@galoya.lk` or `info@galoya.lk`
4. Set a strong password
5. **Save this password** - you'll need it for SMTP_PASS

### Step 3: Get SMTP Settings
1. In cPanel, find **"Email Accounts"**
2. Click **"Connect Devices"** next to your email
3. Look for **"Mail Client Manual Settings"**

You'll see:
```
Incoming Server (IMAP):
- Server: mail.galoya.lk
- Port: 993
- SSL: Yes

Outgoing Server (SMTP):
- Server: mail.galoya.lk  ← Use this for SMTP_HOST
- Port: 465               ← Use this for SMTP_PORT
- SSL: Yes                ← Set SMTP_SECURE=true
```

### Your .env Settings:
```bash
SMTP_HOST=mail.galoya.lk
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@galoya.lk
SMTP_PASS=your_password_from_step2
```

---

## Method 2: Webmail Settings

1. Login to webmail: `https://galoya.lk/webmail`
2. Click **"Help"** or **"Settings"**
3. Look for **"Email Client Configuration"**

---

## Method 3: Ask Your Hosting Provider

Email your hosting support:

```
Subject: SMTP Server Details Request

Hello,

I need the SMTP server settings for my domain galoya.lk to send emails 
from my website contact form.

Please provide:
- SMTP Host
- SMTP Port (465 or 587)
- SSL/TLS settings
- Authentication method

Domain: galoya.lk
Account: [Your hosting username]

Thank you!
```

---

## Common SMTP Settings by Provider

### **SiteGround**
```
SMTP_HOST=mail.galoya.lk
SMTP_PORT=465
SMTP_SECURE=true
```

### **Bluehost**
```
SMTP_HOST=mail.galoya.lk
SMTP_PORT=465
SMTP_SECURE=true
```

### **HostGator**
```
SMTP_HOST=mail.galoya.lk
SMTP_PORT=587
SMTP_SECURE=false
```

### **GoDaddy**
```
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=465
SMTP_SECURE=true
```

### **Namecheap**
```
SMTP_HOST=mail.galoya.lk
SMTP_PORT=587
SMTP_SECURE=false
```

---

## Testing Your Settings

After adding settings to .env:

```bash
# Start server
npm run dev

# Check terminal for:
✅ Email server is ready to send messages
   Connected to: mail.galoya.lk
   Using email: noreply@galoya.lk
```

If you see error:
```
❌ Email server connection failed
```

Then:
1. Double-check username/password
2. Try port 587 instead of 465
3. Try SMTP_SECURE=false
4. Check if hosting blocks port 465/587
5. Contact hosting support

---

## Security Notes

### Create Separate Email for Website
✅ Use `noreply@galoya.lk` or `website@galoya.lk`  
❌ Don't use main company email `info@galoya.lk` directly

### Strong Password
- Minimum 16 characters
- Mix of letters, numbers, symbols
- Store securely in .env

### Email Limits
Most shared hosting limits:
- 100-500 emails per hour
- 1000-2000 emails per day

If exceeded, emails will be queued or bounced.

---

## Troubleshooting

### Error: "Invalid login"
→ Check SMTP_USER and SMTP_PASS are correct

### Error: "Connection timeout"
→ Try port 587, or check firewall settings

### Error: "Self-signed certificate"
→ Already handled in code with `rejectUnauthorized: false`

### Emails not arriving
→ Check spam folder, whitelist sender domain

---

## Alternative: Use Gmail (Temporary)

If you can't find settings, temporarily use Gmail:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password  # Not regular password!
```

But emails will show "via gmail.com" - not professional.

---

## Recommended Setup

**Best Practice:**

1. Create: `noreply@galoya.lk` (for sending)
2. Receive to: `info@galoya.lk` (main inbox)
3. CC to: `hr@galoya.lk`, `manager@galoya.lk`

```bash
SMTP_USER=noreply@galoya.lk
CONTACT_EMAIL_TO=info@galoya.lk
CONTACT_EMAIL_CC=hr@galoya.lk,manager@galoya.lk
```

This way:
- Website sends from `noreply@galoya.lk`
- All inquiries go to `info@galoya.lk`
- HR and Manager get copies
- Customers can reply directly to `noreply@galoya.lk`