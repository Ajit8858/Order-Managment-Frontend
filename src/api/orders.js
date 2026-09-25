import client from "./client";

// --- Cart ---
export const getCart = () => client.get("/cart").then((r) => r.data);
export const addCartItem = (product_id, quantity = 1) =>
  client.post("/cart/items", { product_id, quantity }).then((r) => r.data);
export const updateCartItem = (itemId, quantity) =>
  client.patch(`/cart/items/${itemId}`, { quantity }).then((r) => r.data);
export const removeCartItem = (itemId) => client.delete(`/cart/items/${itemId}`).then((r) => r.data);
export const clearCart = () => client.delete("/cart").then((r) => r.data);

// --- Orders ---
export const createOrder = () => client.post("/orders").then((r) => r.data);
export const listOrders = (params) => client.get("/orders", { params }).then((r) => r.data);
export const getOrder = (id) => client.get(`/orders/${id}`).then((r) => r.data);
export const cancelOrder = (id) => client.post(`/orders/${id}/cancel`).then((r) => r.data);
export const updateOrderStatus = (id, status) =>
  client.patch(`/orders/${id}/status`, { status }).then((r) => r.data);

// --- Payments ---
export const processPayment = (order_id, card_token) =>
  client.post("/payments", { order_id, card_token }).then((r) => r.data);
export const getPayment = (orderId) => client.get(`/payments/${orderId}`).then((r) => r.data);
