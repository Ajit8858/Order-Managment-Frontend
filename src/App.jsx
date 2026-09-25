import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ReviewOrderPage from "./pages/ReviewOrderPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminProductFormPage from "./pages/AdminProductFormPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<CatalogPage />} />
              <Route
                path="/admin"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminDashboardPage />
                  </RoleRoute>
                }
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/review-order" element={<ReviewOrderPage />} />
              <Route path="/checkout/:orderId" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />

              <Route
                path="/admin/products"
                element={
                  <RoleRoute roles={["admin", "seller"]}>
                    <AdminProductsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <RoleRoute roles={["admin", "seller"]}>
                    <AdminProductFormPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/products/:id/edit"
                element={
                  <RoleRoute roles={["admin", "seller"]}>
                    <AdminProductFormPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminUsersPage />
                  </RoleRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
