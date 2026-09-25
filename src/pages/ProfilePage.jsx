import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", street: "", city: "", state: "", zip_code: "" });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      street: user?.street || "",
      city: user?.city || "",
      state: user?.state || "",
      zip_code: user?.zip_code || "",
    });
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      await authApi.updateMe(form);
      await refreshProfile();
      setStatus("Profile updated successfully.");
    } catch (err) {
      setStatus(err.response?.data?.detail || "Couldn't update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="eyebrow mb-2">Workspace / Account</p>
        <h1 className="font-display text-3xl font-semibold text-ink">Your profile</h1>
        <p className="text-sm text-muted mt-2">Keep your personal details current across the operation.</p>
      </div>

      <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-5">
        <div className="surface bg-ink text-paper p-6">
          <div className="w-14 h-14 bg-amber text-ink flex items-center justify-center font-display text-2xl font-semibold mb-6">
            {(user?.full_name || user?.email || "U").slice(0, 1).toUpperCase()}
          </div>
          <p className="font-display text-xl font-semibold">{user?.full_name || "Unnamed user"}</p>
          <p className="text-sm text-paper/60 mt-1 break-all">{user?.email}</p>
          <span className="inline-block mt-6 border border-paper/20 px-2 py-1 text-[10px] font-mono uppercase tracking-wide2 text-paper/70">{user?.role} access</span>
        </div>

        <form onSubmit={handleSubmit} className="surface p-6">
          {status && <div className={`mb-5 border-l-2 px-3 py-2 text-sm ${status.includes("successfully") ? "border-depot bg-depot-soft text-depot" : "border-alarm bg-alarm-soft text-alarm"}`}>{status}</div>}
          <div className="mb-5">
            <label className="field-label">Full name</label>
            <input className="field-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" />
          </div>
          <div className="mb-5">
            <label className="field-label">Phone</label>
            <input className="field-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional phone number" />
          </div>
          <div className="mb-6">
            <p className="eyebrow mb-4">Delivery address</p>
            <div className="mb-4">
              <label className="field-label">Address line</label>
              <input className="field-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Apartment, floor, landmark" />
            </div>
            <div className="mb-4">
              <label className="field-label">Street</label>
              <input className="field-input" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Street and building" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="field-label">City</label><input className="field-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Mumbai" /></div>
              <div><label className="field-label">State</label><input className="field-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Maharashtra" /></div>
            </div>
            <div className="mb-6"><label className="field-label">PIN code</label><input className="field-input" value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} placeholder="400001" inputMode="numeric" /></div>
          </div>
          <div className="mb-6">
            <label className="field-label">Email</label>
            <input className="field-input bg-paper cursor-not-allowed" value={user?.email || ""} disabled />
            <p className="text-xs text-muted mt-2">Email and role are managed by the system.</p>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
        </form>
      </div>
    </div>
  );
}
