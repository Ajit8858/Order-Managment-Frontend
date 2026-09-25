import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Command center", end: true, roles: ["admin"] },
  { to: "/", label: "Catalog", end: true, roles: ["customer", "seller"] },
  { to: "/orders", label: "Orders", roles: null },
  { to: "/cart", label: "Cart", roles: ["customer", "seller", "admin"] },
  { to: "/admin/products", label: "Inventory", roles: ["admin", "seller"] },
  { to: "/admin/users", label: "Users", roles: ["admin"] },
  { to: "/profile", label: "Profile", roles: null },
];

function NavItemLink({ item, badge }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center justify-between mx-3 px-3 py-2.5 text-sm border-l-2 transition-colors ${
          isActive
            ? "border-amber bg-ink-soft text-paper font-medium"
            : "border-transparent text-paper/70 hover:text-paper hover:bg-ink-soft/60"
        }`
      }
    >
      <span>{item.label}</span>
      {badge > 0 && (
        <span className="font-mono text-xs bg-amber text-ink px-1.5 leading-5 min-w-[1.4rem] text-center">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { itemCount, refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const visibleNav = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role));

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-ink flex flex-col shrink-0 md:min-h-screen">
        <div className="px-5 py-5 md:py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-amber text-ink flex items-center justify-center font-display font-bold">M</span>
            <div>
              <p className="font-display font-semibold text-paper text-lg leading-none">Manifest</p>
              <p className="text-[10px] text-paper/50 mt-1 font-mono uppercase tracking-wide2">operations</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 md:py-5 flex md:block overflow-x-auto">
          {visibleNav.map((item) => (
            <NavItemLink key={item.to} item={item} badge={item.to === "/cart" ? itemCount : 0} />
          ))}
        </nav>

        <div className="hidden md:block px-5 py-4 border-t border-white/10">
          <p className="text-sm text-paper truncate">{user?.full_name || user?.email}</p>
          <p className="text-xs text-paper/50 font-mono uppercase tracking-wide2 mt-0.5">{user?.role} account</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-between border border-white/15 px-3 py-2 text-xs text-paper/70 hover:border-amber hover:text-paper hover:bg-ink-soft transition-colors"
          >
            <span>Sign out</span><span aria-hidden="true" className="text-amber text-base">↗</span>
          </button>
        </div>
        <div className="md:hidden px-4 pb-3 flex justify-between items-center border-t border-white/10">
          <span className="text-xs text-paper/60">{user?.role} account</span>
          <button onClick={handleLogout} className="border border-white/15 px-3 py-1.5 text-xs text-paper/70 hover:border-amber hover:text-paper transition-colors">Sign out ↗</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
