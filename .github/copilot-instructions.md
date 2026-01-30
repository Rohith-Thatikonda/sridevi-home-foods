# AI Coding Guidelines for Sridevi Home Foods & Pickles

## Project Overview
Single-page web application (HTML/CSS/JS) for ordering home-cooked foods and pickles. Orders are sent directly to a WhatsApp business account. No backend API—state is managed entirely in the browser.

## Architecture & Data Flow

### Product Catalog
- **Home Foods**: Defined in `app.js` `HOME_FOODS` array (product objects with `pricePerKg`, unit is kg)
- **Pickles**: Defined in `app.js` `PICKLES` array (flat pricing per jar, includes `kind: 'veg'|'non-veg'`)
- Product cards are generated dynamically via `createProductCard()` and rendered to `#homeFoodsList` and `#picklesList`

### Shopping Cart
- Client-side array (`cart`) stores cart items with structure: `{ id, name, type, qty, unit, unitPrice }`
- Type is either `'home'` (kg) or `'pickle'` (jar)
- Cart operations: `addToCart()` → `renderCart()` (updates UI and cart count badge)
- Remove button in cart calls `renderCart()` after splicing the item

### Order Submission
1. User fills form (name, phone, address, payment method)
2. `buildOrderPayload()` converts cart to structured order object
3. `buildWhatsAppText()` formats payload as human-readable text with line breaks
4. `sendToWhatsApp()` opens WhatsApp Web URL: `https://wa.me/{WHATSAPP_NUMBER}?text={encoded_text}`
5. User manually presses SEND in WhatsApp (this is intentional—not automated)

## Key Configuration
- **WhatsApp Number**: Set `WHATSAPP_NUMBER` constant at top of `app.js` (format: country code + number, e.g., '919866406807' for India)
- Images stored in `images/` folder (product images, banner). Fallback: placeholder SVG if image 404s

## UI & Styling
- **Bootstrap 5** (CDN): grid layout, cards, buttons, responsive navbar
- **Custom CSS** in `styles.css`: product card images (120px × 84px), header banner overlay, responsive adjustments at 576px breakpoint
- Navbar has cart button with count badge; clicking scrolls to cart section on mobile

## Important Patterns

### Error Handling for Images
- Product images have `onerror` handler: if `.jpg` fails, tries `.svg` of same name; falls back to inline SVG placeholder if both fail
- This allows flexible image formats without code changes

### Form Validation
- Form fields (name, phone, address) are required; button disabled until cart is non-empty
- Phone not validated (accepts any input)—merchants verify manually

### Query Selectors Shorthand
- `$()` = `document.querySelector()`
- `$all()` = `Array.from(document.querySelectorAll())`
- Used throughout for DOM manipulation

## Development Notes
- No build step or transpilation—vanilla JS
- No external API calls except WhatsApp Web
- `response.json` is unused (legacy file)
- All state lost on page refresh (stateless design by intent)
- Testing: open `index.html` in browser, add items, check WhatsApp URL format

## Common Tasks
- **Add new product**: Push object to `HOME_FOODS` or `PICKLES` array in `app.js`, add image to `images/`
- **Change pricing**: Edit `pricePerKg` or `price` fields in product objects
- **Customize messages**: Edit template strings in `buildWhatsAppText()` (use `\n` for line breaks)
- **Update WhatsApp number**: Change `WHATSAPP_NUMBER` variable (must include country code)
