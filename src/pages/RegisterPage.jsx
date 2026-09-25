import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "customer" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm page-enter">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6"><span className="w-9 h-9 bg-amber text-ink flex items-center justify-center font-display font-bold">M</span><span className="font-display font-semibold text-2xl text-ink">Manifest</span></div>
          <p className="eyebrow">Create your workspace access</p>
        </div>

        <form onSubmit={handleSubmit} className="surface p-8">
          <h1 className="font-display text-2xl font-semibold mb-2">Join the workspace.</h1>
          <p className="text-sm text-muted mb-6">Choose how you’ll use Manifest to get started.</p>

          {error && (
            <div className="mb-4 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="field-label">Full name</label>
            <input
              className="field-input"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Jordan Lee"
            />
          </div>

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

          <div className="mb-4">
            <label className="field-label">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="field-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="mb-6">
            <label className="field-label">Account type</label>
            <select
              className="field-input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer — shop and place orders</option>
              <option value="seller">Seller — list and manage products</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <p className="text-sm text-muted text-center mt-6">
            Already registered?{" "}
            <Link to="/login" className="text-ink underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
