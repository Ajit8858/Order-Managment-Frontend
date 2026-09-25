import client from "./client";

export const register = (payload) => client.post("/auth/register", payload).then((r) => r.data);

export const login = (payload) => client.post("/auth/login", payload).then((r) => r.data);

export const logout = (refresh_token) => client.post("/auth/logout", { refresh_token }).then((r) => r.data);

export const getMe = () => client.get("/users/me").then((r) => r.data);

export const updateMe = (payload) => client.patch("/users/update", payload).then((r) => r.data);
