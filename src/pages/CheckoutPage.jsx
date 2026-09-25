import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as ordersApi from "../api/orders";
import StatusBadge from "../components/StatusBadge";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

export default function CheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [order, setOrder] = useState(null);
  const [cardToken, setCardToken] = useState("tok_test_success");
  const [paying, setPaying] = useState(false);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  const loadOrder = () => ordersApi.getOrder(orderId).then(setOrder);

  useEffect(() => {
    loadOrder();
    refreshCart();
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePay = async () => {
    setPaying(true);
    setError("");
    try {
      const result = await ordersApi.processPayment(orderId, cardToken);
      setPayment(result);
      await loadOrder();
    } catch (err) {
      setError(err.response?.data?.detail || "Payment could not be processed");
    } finally {
      setPaying(false);
    }
  };

  if (!order) return <p className="text-sm text-muted">Loading order…</p>;

  const isPending = order.status === "PENDING" || order.status === "PAYMENT_FAILED";
  const isPaid = order.status === "ORDER_CONFIRMED";

  return (
    <div className="max-w-xl">
      <p className="eyebrow mb-2">Workspace / Payment</p>
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">Complete checkout</h1>
      <p className="text-sm font-mono text-muted mb-8">Order {order.id}</p>

      <div className="surface p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-ink">Order status</span>
          <StatusBadge status={order.status} />
        </div>
        <div className="border-t border-line pt-4 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-mono text-ink">{formatCurrency(Number(item.unit_price) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-line mt-4 pt-4">
          <span className="font-display font-medium">Total</span>
          <span className="font-mono text-lg">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      {isPending && (
        <div className="surface p-6">
          <h2 className="font-display font-medium text-ink mb-1">Payment</h2>
          <p className="text-xs text-muted mb-4">
            Simulated gateway — this is a demo, no real card is charged.
          </p>

          {error && (
            <div className="mb-4 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">{error}</div>
          )}

          <label className="field-label">Card token</label>
          <select className="field-input mb-4" value={cardToken} onChange={(e) => setCardToken(e.target.value)}>
            <option value="tok_test_success">tok_test_success — succeeds</option>
            <option value="tok_test_fail">tok_test_fail — declines</option>
          </select>

          <button className="btn-primary w-full" onClick={handlePay} disabled={paying}>
            {paying ? "Processing…" : `Pay ${formatCurrency(order.total_amount)}`}
          </button>
        </div>
      )}

      {isPaid && (
        <div className="border-l-2 border-depot bg-depot-soft px-5 py-4">
          <p className="text-depot font-medium text-sm mb-2">Payment confirmed — your order is on its way.</p>
          <Link to="/orders" className="text-sm underline underline-offset-2 text-depot">
            View order history
          </Link>
        </div>
      )}

      {order.status === "CANCELLED" && (
        <div className="border-l-2 border-muted bg-paper-raised px-5 py-4">
          <p className="text-sm text-muted">This order was cancelled.</p>
        </div>
      )}
    </div>
  );
}
