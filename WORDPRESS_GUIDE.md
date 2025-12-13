# How to Move This Project to WordPress

This project is currently a **React Static Site**. It is **not** a WordPress Theme (PHP).
You cannot simply upload these files to the `wp-content/themes` folder.

However, the code has been structured to make **recreating this design in WordPress very easy**.

## Option 1: The "Elementor" Approach (Recommended for Non-Coders)
Since you mentioned using Elementor Free, here is how you translate the components:

### 1. Portfolio Grid (The "Portfolio" Page)
- **React Component:** `client/src/components/PortfolioCard.tsx`
- **WordPress Equivalent:**
  1. Install a "Custom Post Type UI" plugin.
  2. Create a Post Type called `Portfolio`.
  3. Create your Portfolio items in the WP Dashboard.
  4. In Elementor, use the **"Posts"** widget (or "Portfolio" widget in Pro).
  5. Style the "Skin" to match the CSS classes in `PortfolioCard.tsx` (e.g., aspect ratio, hover overlay).

### 2. Single Project Page (The "CSR Event" Page)
- **React Component:** `client/src/pages/CSREvent.tsx`
- **WordPress Equivalent:**
  1. Create a "Single Post Template" in Elementor (requires Pro usually, or a free "Header/Footer Builder" plugin).
  2. **Slider:** Use the **Image Carousel** widget.
  3. **Content:** Use the **Post Content** widget.
  4. **Sidebar:** Use a **Section** with 30% width and add Text Editor widgets for "Location", "Date", etc.

### 3. Contact Form
- **React Component:** `client/src/components/ContactForm.tsx`
- **WordPress Equivalent:**
  - Install **WPForms** or **Contact Form 7**.
  - Create a form with fields: Name, Email, Phone, Message.
  - Paste the shortcode into your Contact page.

---

## Option 2: The "Headless" Approach (Advanced)
If you want to keep this exact React code:
1. Keep this site hosted on Vercel/Netlify.
2. Use WordPress **only** for managing content (as a database).
3. Connect them using the WordPress REST API.
*(This requires significant developer knowledge)*.

## Option 3: Custom Theme Development (For Developers)
If you have a PHP developer:
1. They can copy the HTML from the browser "View Source" or the React components.
2. They will paste the HTML into `page-portfolio.php` and `single-portfolio.php`.
3. They will replace the static text with PHP tags like `<?php the_title(); ?>`.
4. The CSS in `index.css` is standard Tailwind/CSS and can be copied directly to the theme's `style.css`.
