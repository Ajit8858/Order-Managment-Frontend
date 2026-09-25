import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as ordersApi from "../api/orders";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import ProductImage from "../components/ProductImage";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";

export default function ReviewOrderPage() {
  const { cart, refreshCart } = useCart();
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({ address: "", street: "", city: "", state: "", zip_code: "" });

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    setAddress({ address: user?.address || "", street: user?.street || "", city: user?.city || "", state: user?.state || "", zip_code: user?.zip_code || "" });
  }, [user]);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.zip_code.trim()) {
        setError("Please complete your delivery address before continuing.");
        return;
      }
      await authApi.updateMe(address);
      await refreshProfile();
      const order = await ordersApi.createOrder();
      navigate(`/checkout/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't create your order. Please review your cart and try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart) return <p className="text-sm text-muted">Loading your review…</p>;

  if (cart.items.length === 0) {
    return (
      <div>
        <p className="eyebrow mb-2">Workspace / Review</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-8">Review order</h1>
        <EmptyState title="Nothing to review" hint="Your cart is empty. Add products before continuing." action={<Link to="/" className="btn-primary">Browse catalog</Link>} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="eyebrow mb-2">Workspace / Checkout</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">Review your order</h1>
        <p className="text-sm text-muted mt-2">Make sure everything looks right before you reserve stock and continue to payment.</p>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-5 items-start">
        <section className="surface">
          <div className="p-5 border-b border-line flex items-center justify-between">
            <div><p className="eyebrow">Order contents</p><h2 className="font-display text-xl font-semibold mt-1">{cart.items.length} line item{cart.items.length === 1 ? "" : "s"}</h2></div>
            <Link to="/cart" className="btn-edit"><span aria-hidden="true">✎</span> Edit cart</Link>
          </div>
          <div>
            {cart.items.map((item) => (
              <div key={item.id} className="p-5 border-b border-line flex gap-4 items-center">
                <ProductImage product={item.product} className="w-16 h-16 shrink-0" />
                <div className="min-w-0 flex-1"><p className="font-medium text-ink truncate">{item.product.name}</p><p className="text-xs font-mono text-muted mt-1">{item.product.sku} · Qty {item.quantity}</p></div>
                <p className="font-mono text-sm text-ink">{formatCurrency(Number(item.product.price) * item.quantity)}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <section className="surface p-5">
            <div className="flex items-center justify-between mb-4"><div><p className="eyebrow">Delivery</p><h2 className="font-display text-xl font-semibold mt-1">Your address</h2></div><Link to="/profile" className="btn-edit">Edit profile</Link></div>
            <div className="space-y-3">
              <input className="field-input" placeholder="Apartment, floor, landmark" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} />
              <input className="field-input" placeholder="Street and building *" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              <div className="grid grid-cols-2 gap-3"><input className="field-input" placeholder="City *" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /><input className="field-input" placeholder="State *" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></div>
              <input className="field-input" placeholder="PIN code *" value={address.zip_code} onChange={(e) => setAddress({ ...address, zip_code: e.target.value })} inputMode="numeric" />
            </div>
          </section>
          <section className="surface p-5">
          <p className="eyebrow mb-4">Order summary</p>
          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between text-muted"><span>Items</span><span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
            <div className="flex justify-between text-muted"><span>Shipping</span><span className="text-depot">Free</span></div>
          </div>
          <div className="border-t border-line pt-4 flex justify-between items-end"><span className="font-display font-semibold">Total</span><span className="font-mono text-2xl">{formatCurrency(cart.total)}</span></div>
          {error && <div className="mt-5 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">{error}</div>}
          <button className="btn-primary w-full mt-5" onClick={handlePlaceOrder} disabled={placing}>{placing ? "Preparing order…" : "Confirm and continue"}<span aria-hidden="true">→</span></button>
          <p className="text-[11px] text-muted text-center mt-3">Stock is reserved when you confirm this order.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
