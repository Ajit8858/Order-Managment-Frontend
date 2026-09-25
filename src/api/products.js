import client from "./client";

export const listProducts = (params) => client.get("/products", { params }).then((r) => r.data);

export const getProduct = (id) => client.get(`/products/${id}`).then((r) => r.data);

export const createProduct = (payload) => client.post("/products", payload).then((r) => r.data);

export const updateProduct = (id, payload) => client.patch(`/products/${id}`, payload).then((r) => r.data);

export const deleteProduct = (id) => client.delete(`/products/${id}`).then((r) => r.data);

export const listCategories = () => client.get("/products/categories").then((r) => r.data);

export const createCategory = (payload) => client.post("/products/categories", payload).then((r) => r.data);
