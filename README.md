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
