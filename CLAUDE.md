# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, localhost:5173)
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

The backend API must be running separately on `http://localhost:5000` for the app to function.

## Architecture

**NawaWeeb** is an anime-themed e-commerce frontend (React 19 + Vite) that connects to a Node.js/Express backend at `localhost:5000`.

### Request Flow

All API calls go through `src/api/axios.js`, which attaches JWT tokens from `localStorage` via an interceptor. Auth state is managed globally in `src/context/AuthContext.jsx`.

### Routing (`src/App.jsx`)

Two layout shells:
- **`HomeLayout`** — wraps all public routes with Navbar + Footer
- **`AdminLayout`** — wraps `/admin/*` routes behind a `ProtectedRoute` that checks `localStorage` for `token` and `role === "admin"`

### Cart Architecture

Dual-mode cart with sync on login:
- **Guest:** stored in `localStorage`
- **Authenticated:** synced to server (`POST /api/user/cart/sync`)
- On login, guest cart is uploaded, server cart is merged, final state is pulled back and stored locally
- `HomeLayout` handles a "pending artifact" pattern: if a user adds to cart while unauthenticated, the item is stored and added after login

### Design System

Tailwind v4 with custom tokens in `tailwind.config.js`:
- `primary` (#3c4142) — charcoal base
- `accent` (#EFC853) — gold highlight
- Fonts: `font-clash` (ClashDisplay, headlines), `font-editor` (Editorial, body)
- CSS variables in `src/styles/globals.css` for background, text, card colors, and shadows

### Key Patterns

- **Product variants:** Size-based; stock tracked per variant
- **Handmade toggle:** applies a 1.5x price multiplier in `ProductDetail` and `Cart`
- **Dynamic Navbar menus:** Fetches `/api/products` on mount to build "New Drops" and "Collections" dropdowns
- **Scroll-aware Navbar:** Uses `src/hooks/useScrollDirection.js` to apply blur/background on scroll
