import { useEffect, useState } from "react";
import client from "../api/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    setError("");
    client
      .get("/users")
      .then((r) => setUsers(r.data))
      .catch((err) => setError(err.response?.data?.detail || "Couldn't load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-2">Administration / Access</p>
        <h1 className="font-display text-3xl font-semibold text-ink">User management</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted mt-2">Review the people, roles, and delivery details connected to your operation.</p>
          <button type="button" className="btn-secondary text-xs" onClick={loadUsers} disabled={loading}>{loading ? "Loading…" : "↻ Refresh users"}</button>
        </div>
      </div>

      {loading && !users && <p className="text-sm text-muted">Loading users…</p>}

      {error && (
        <div className="flex items-center justify-between gap-4 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">
          <span>{error}</span>
          <button type="button" className="btn-remove shrink-0" onClick={loadUsers}>Try again</button>
        </div>
      )}

      {users && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="surface p-4"><p className="eyebrow">Total accounts</p><p className="font-display text-2xl mt-2">{users.length}</p></div>
            <div className="surface p-4"><p className="eyebrow">Roles in use</p><p className="font-display text-2xl mt-2">{new Set(users.map((u) => u.role)).size}</p></div>
          </div>
          <div className="surface mobile-scroll">
          <div className="ledger-row grid-cols-[1fr_auto_auto_auto_auto] px-5 !border-b-2 !border-line-strong text-xs font-mono uppercase tracking-wide2 text-muted">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Account</span>
            <span>Joined</span>
          </div>
          {users.map((u) => (
            <div key={u.id} className="ledger-row grid-cols-[1fr_auto_auto_auto_auto] px-5">
              <div><span className="text-sm text-ink">{u.full_name || "Unnamed user"}</span><p className="text-xs text-muted mt-1">{u.city || "No address saved"}</p></div>
              <span className="text-sm font-mono text-muted">{u.email}</span>
              <span className="text-xs font-mono uppercase tracking-wide2 text-ink">{u.role}</span>
              <span className={`text-xs font-mono uppercase ${u.is_active ? "text-depot" : "text-alarm"}`}>{u.is_active ? "Active" : "Inactive"}</span>
              <span className="text-sm text-muted">{new Date(u.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
}
