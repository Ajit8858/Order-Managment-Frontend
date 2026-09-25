# Manifest — Order Management Frontend

A React (Vite + Tailwind) frontend for the FastAPI order-management backend:
storefront catalog, cart, checkout with simulated payment, order history with a
status timeline, and an inventory/users admin area — all role-aware (customer /
seller / admin).

## Design

Built around the subject matter — SKUs, order IDs, shipment statuses — rather
than a generic dashboard template: hairline-divided "ledger" rows instead of
shadowed cards, monospace (IBM Plex Mono) for all data values, Space Grotesk for
headings, a cool paper background, and status badges styled like manifest stamps.

## Requirements

- Node 18+
- The FastAPI backend running and reachable (see the backend's own README)

## Setup

```bash
npm install
cp .env.example .env
# Edit .env if your backend isn't at http://localhost:8000
npm run dev
```

The app runs at http://localhost:5173. Make sure the backend's CORS config
allows this origin (the sample backend allows `*` by default).

## What's implemented

- **Auth**: register (customer/seller — admin accounts aren't self-registrable,
  matching the backend), login, JWT stored in `localStorage`, automatic
  refresh-token rotation on 401 via an axios interceptor, logout.
- **Catalog**: search, category filter, sort (price/name/newest), pagination,
  add-to-cart from the grid or a product detail page.
- **Cart**: quantity adjustment, line removal, running total, checkout.
- **Checkout**: creates the order, then runs it through the simulated payment
  gateway (`tok_test_success` / `tok_test_fail`) with live status feedback.
- **Orders**: paginated history, detail view with a visual status timeline,
  cancel (while cancellable), retry payment (while payable).
- **Admin/seller**: create/edit/deactivate products, add categories inline,
  admins can advance an order to the next fulfilment step (confirmed → shipped
  → delivered) and view the user list.

## Known limitations (inherited from the backend's API surface)

- There's no "all orders" endpoint, so admins/sellers can only act on a specific
  order if they already have its ID (e.g. shared by the customer) — there's no
  storewide order queue in this UI because the API doesn't expose one yet.
- Product edits are scoped to the seller who created them (admins can edit any);
  the UI relies on the backend's 403 rather than hiding the edit link, so a
  seller can attempt an edit on another seller's product and see the resulting
  error state.

## Project layout

```
src/
  api/          axios client (with token refresh) + endpoint wrappers
  context/      AuthContext, CartContext
  components/   Layout/sidebar, ProductCard, StatusBadge, Pagination, route guards
  pages/        one file per route
```
