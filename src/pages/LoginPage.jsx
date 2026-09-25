import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getRoleHome = (role) => {
    if (role === "admin") return "/admin";
    if (role === "seller") return "/admin/products";
    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      const requestedPath = location.state?.from?.pathname;
      const isGenericDestination = !requestedPath || requestedPath === "/login" || requestedPath === "/";
      navigate(isGenericDestination ? getRoleHome(user.role) : requestedPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't sign in. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm page-enter">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6"><span className="w-9 h-9 bg-amber text-ink flex items-center justify-center font-display font-bold">M</span><span className="font-display font-semibold text-2xl text-ink">Manifest</span></div>
          <p className="eyebrow">Operations workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="surface p-8">
          <h1 className="font-display text-2xl font-semibold mb-2">Welcome back.</h1>
          <p className="text-sm text-muted mb-6">Sign in to manage your orders and inventory.</p>

          {error && (
            <div className="mb-4 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="field-label">Email</label>
            <input
              type="email"
              required
              className="field-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="field-label">Password</label>
            <input
              type="password"
              required
              className="field-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-sm text-muted text-center mt-6">
            No account?{" "}
            <Link to="/register" className="text-ink underline underline-offset-2">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
