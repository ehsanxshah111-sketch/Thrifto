# Thrifto — MERN Shoe Store

A full-stack MERN e-commerce site for a shoe brand called **Thrifto**, in a
classical black & white premium theme (serif typography, hairline gold
accents, editorial spacing). Prices are shown in **PKR**. Includes a sliding
brand banner with a rotating 360° logo badge, separate customer and admin
logins, and an admin panel to add, edit, restock, or mark products sold out —
plus admin-only views of orders and contact messages.

## Stack
- MongoDB + Mongoose
- Express (REST API, JWT auth)
- React (Create React App, React Router, Context API)
- Node.js

## Project structure
```
thrifto/
  backend/     Express API (auth, products, orders, messages)
  frontend/    React app (customer storefront + admin dashboard)
```

## 1. Prerequisites
- Node.js 18+
- A MongoDB database — either a local `mongod` instance, or a free cluster
  from MongoDB Atlas (recommended if you don't want to install MongoDB
  locally).

## 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env`:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the first admin account

Create the admin account and sample data, then start the API:
```bash
npm run seed                  # creates the admin user from .env
node seed/seedProducts.js     # adds 6 sample Thrifto shoes
node seed/seedPromotions.js   # adds sample homepage banners (optional)
npm run dev                    # starts the API on http://localhost:5000
```

## 3. Frontend setup (development — two ports)
In a new terminal:
```bash
cd frontend
npm install
cp .env.example .env       # REACT_APP_API_URL=http://localhost:5000/api
npm start                  # opens http://localhost:3000
```
While developing, the API runs on `5000` and the React dev server runs on
`3000` — this is normal for MERN and gives you hot-reload on the frontend.

## 3b. Running everything on one port instead
If you'd rather have a single URL serve the whole site (no separate
frontend port), build the React app and let Express serve the compiled
files:
```bash
cd frontend
npm install
npm run build          # outputs frontend/build/

cd ../backend
npm install
# add NODE_ENV=production to backend/.env
npm start
```
Now the storefront, admin panel, and API are all available at
`http://localhost:5000` — no `frontend/.env` needed in this mode, since the
browser is already on the same origin as the API. The trade-off: this
serves a static build, so any frontend code change requires re-running
`npm run build` and restarting the server. For active development, use the
two-port setup in step 3 instead.

## 4. Using the site
- **Customers**: register at `/register`, sign in at `/login` (linked in
  the nav), browse `/shop`, add to cart, and check out. Their orders are
  visible to them only at `/my-orders`.
- **Admin**: sign in at `/admin/login` — a hidden URL that isn't linked
  anywhere in the site's navigation, footer, or any other page. You have to
  know it and type it directly. Use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you
  set in the backend `.env`. On success you land on `/admin`, where you can:
  - **Products** — add new shoes, edit any field, one-click toggle
    "Sold Out" / "In Stock", or delete a listing.
  - **Orders** — see every order placed by every customer and update its
    status.
  - **Messages** — read everything submitted through the public Contact
    form.

The two login flows are fully separated, not just two paths to the same
form:
- The public `/login` form rejects admin credentials — if an admin account
  is entered there, it signs them straight back out with a message
  pointing them to the admin sign-in instead of leaving them logged in.
- The hidden `/admin/login` form does the reverse — a non-admin account is
  signed out immediately with an "administrators only" message.
- The navbar only ever shows the "Admin Panel" link when a session is both
  logged in *and* an admin — customers and logged-out visitors never see
  any mention of it.
- Customers can never reach `/admin` itself (the frontend route guard
  redirects them), and the backend independently enforces the same rule
  with `protect` + `adminOnly` middleware on the orders and messages
  routes, so none of this is just a UI-level restriction.

## 5. Promotions & announcements
Admin > Promotions lets you add homepage banners without touching code —
e.g. an Independence Day sale, a limited-time discount, or a "New In"
callout:
- **Hero Carousel** placement — rotates through the slides at the very top
  of the homepage (auto-advances every 5s, with dot navigation).
- **Promo Banner** placement — the single full-width dark strip further
  down the homepage; the most recent active one is shown.
- Each promotion has a title, small "eyebrow" label, description, and a
  button (text + link, e.g. `/shop` or `/shop?category=Sneakers`).
- **Active** toggle turns it on/off instantly without deleting it.
- Optional **start/end dates** let you schedule something like "8 Aug –
  16 Aug" and it'll stop showing on its own — no need to remember to turn
  it off.
- If there are no active hero or banner promotions, the homepage falls
  back to sensible defaults so it's never empty on a fresh install.
- **Theme** — each promotion has its own color scheme, independent of the
  others: Classic (black/gold, the site default), Ivory (light background),
  Emerald (deep green — good for something like an Independence Day sale),
  Burgundy (deep red — good for big sale events), or Gold (warm amber).
- **Background Image** (optional) — upload a photo instead of using a flat
  theme color; it displays behind the banner text with a dark overlay
  automatically applied so the text stays readable.

## 6. Product images
Two ways to set a product's photo from the Admin > Products form:
- **Upload your own** — the "Upload Product Photo" file picker sends the
  image to the backend (`POST /api/upload`, admin-only), which saves it to
  `backend/uploads/` and returns a URL that's used as the product's image.
  This is how you'd add real photos of your own stock.
- **Built-in illustrations** — six original flat-style SVG shoe drawings
  (not photographs) ship in `frontend/public/images/` as a quick fallback/
  placeholder option, matching the black & white theme.

`backend/uploads/` is created automatically and is gitignored — back it up
separately if you deploy, since it isn't part of version control.

## 7. Notes
- `node_modules` are **not** included in this zip — run `npm install` in
  both `backend/` and `frontend/` as shown above.
- Never commit your real `.env` file; only `.env.example` is included.
