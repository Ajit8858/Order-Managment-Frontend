import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as ordersApi from "../api/orders";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

export default function CartPage() {
  const { cart, setCart, refreshCart } = useCart();
  const [busyItem, setBusyItem] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const updateQty = async (itemId, quantity) => {
    const item = cart?.items.find((cartItem) => cartItem.id === itemId);
    if (!item) return;
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }
    if (quantity > item.product.stock) {
      setError(`Only ${item.product.stock} ${item.product.name} available.`);
      return;
    }
    setBusyItem(itemId);
    setError("");
    try {
      const data = await ordersApi.updateCartItem(itemId, quantity);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't update quantity");
    } finally {
      setBusyItem(null);
    }
  };

  const removeItem = async (itemId) => {
    setBusyItem(itemId);
    setError("");
    try {
      const data = await ordersApi.removeCartItem(itemId);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't remove item");
    } finally {
      setBusyItem(null);
    }
  };

  const handleCheckout = async () => {
    navigate("/review-order");
  };

  if (!cart) return <p className="text-sm text-muted">Loading cart…</p>;

  if (cart.items.length === 0) {
    return (
      <div>
        <div className="mb-8"><p className="eyebrow mb-2">Workspace / Basket</p><h1 className="font-display text-3xl font-semibold text-ink">Your cart</h1></div>
        <EmptyState
          title="Your cart is empty"
          hint="Add products from the catalog to get started."
          action={
            <Link to="/" className="btn-primary">
              Browse catalog
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8"><p className="eyebrow mb-2">Workspace / Basket</p><h1 className="font-display text-3xl font-semibold text-ink">Your cart</h1><p className="text-sm text-muted mt-2">Review your selections before placing the order.</p></div>

      {error && (
        <div className="mb-4 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">{error}</div>
      )}

      <div className="surface mobile-scroll">
        <div className="ledger-row grid-cols-[1fr_auto_auto_auto] px-5 !border-b-2 !border-line-strong text-xs font-mono uppercase tracking-wide2 text-muted">
          <span>Product</span>
          <span>Quantity</span>
          <span>Subtotal</span>
          <span></span>
        </div>

        {cart.items.map((item) => (
          <div key={item.id} className="ledger-row grid-cols-[1fr_auto_auto_auto] px-5">
            <div>
              <p className="text-sm text-ink font-medium">{item.product.name}</p>
              <p className="text-xs font-mono text-muted mt-0.5">
                {item.product.sku} · {formatCurrency(item.product.price)} each
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label={`Decrease ${item.product.name} quantity`}
                className="btn-icon text-base"
                disabled={busyItem === item.id}
                onClick={() => updateQty(item.id, item.quantity - 1)}
              >
                −
              </button>
              <input
                aria-label={`${item.product.name} quantity`}
                className="field-input w-14 h-8 px-1 py-1 text-center font-mono"
                type="number"
                min="1"
                max={item.product.stock}
                value={item.quantity}
                disabled={busyItem === item.id}
                onChange={(event) => {
                  const nextQuantity = Number(event.target.value);
                  if (Number.isInteger(nextQuantity) && nextQuantity >= 1) updateQty(item.id, nextQuantity);
                }}
                onBlur={(event) => {
                  if (!event.target.value) event.target.value = item.quantity;
                }}
              />
              <button
                type="button"
                aria-label={`Increase ${item.product.name} quantity`}
                className="btn-icon text-base"
                disabled={busyItem === item.id}
                onClick={() => updateQty(item.id, item.quantity + 1)}
              >
                +
              </button>
              <span className="hidden sm:inline text-[10px] text-muted ml-1">/ {item.product.stock}</span>
            </div>
            <p className="font-mono text-sm text-ink text-right">
              {formatCurrency(Number(item.product.price) * item.quantity)}
            </p>
            <button
              className="btn-remove"
              aria-label={`Remove ${item.product.name} from cart`}
              onClick={() => removeItem(item.id)}
              disabled={busyItem === item.id}
            >
              <span aria-hidden="true">×</span> Remove
            </button>
          </div>
        ))}

        <div className="flex items-center justify-between px-5 py-5 border-t-2 border-line-strong">
          <span className="font-display font-medium text-ink">Total</span>
          <span className="font-mono text-xl text-ink">{formatCurrency(cart.total)}</span>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="btn-primary" onClick={handleCheckout}>
          Review order <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
