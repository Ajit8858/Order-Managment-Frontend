import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const actions = [
  { to: "/admin/products/new", label: "Add product", detail: "Create a listing with pricing, stock, and SKU.", tone: "bg-amber-soft" },
  { to: "/admin/products", label: "Manage inventory", detail: "Edit listings, adjust stock, or deactivate products.", tone: "bg-depot-soft" },
  { to: "/admin/users", label: "Review users", detail: "See every account, role, and join date.", tone: "bg-white" },
  { to: "/orders", label: "Review orders", detail: "Track customer orders and update fulfillment status.", tone: "bg-white" },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="relative overflow-hidden bg-ink text-paper p-6 sm:p-10 mb-8">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow !text-paper/50 mb-3">Admin workspace / Command center</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold leading-tight">Good to see you, {user?.full_name?.split(" ")[0] || "admin"}.</h1>
          <p className="text-paper/65 mt-4 max-w-lg">Your control room for products, people, and fulfillment. Everything important is one step away.</p>
        </div>
        <div className="absolute -right-8 -bottom-16 w-56 h-56 border-[28px] border-amber/80 rotate-45" />
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="eyebrow mb-1">Quick actions</p>
          <h2 className="font-display text-xl font-semibold">Run the operation</h2>
        </div>
        <span className="text-xs font-mono text-muted uppercase">Full access</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link key={action.to} to={action.to} className={`surface ${action.tone} p-5 group hover:-translate-y-1 transition-transform`}>
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-xs text-muted">0{index + 1}</span>
              <span className="text-xl text-muted group-hover:text-ink group-hover:translate-x-1 transition-transform">↗</span>
            </div>
            <h3 className="font-display text-xl font-semibold mt-8">{action.label}</h3>
            <p className="text-sm text-muted mt-2 max-w-xs">{action.detail}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 border-t border-line pt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <Link to="/profile" className="hover:text-ink underline underline-offset-2">Edit your profile</Link>
        <Link to="/" className="hover:text-ink underline underline-offset-2">Preview storefront</Link>
      </div>
    </div>
  );
}
