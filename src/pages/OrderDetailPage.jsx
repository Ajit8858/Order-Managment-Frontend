import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as ordersApi from "../api/orders";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/currency";

const PIPELINE = ["PENDING", "PAYMENT_SUCCESS", "ORDER_CONFIRMED", "SHIPPED", "DELIVERED"];
const NEXT_STEP = { ORDER_CONFIRMED: "SHIPPED", SHIPPED: "DELIVERED" };

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const load = () => ordersApi.getOrder(id).then(setOrder);

  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order? Items will be returned to stock.")) return;
    setCancelling(true);
    setError("");
    try {
      const cancelledOrder = await ordersApi.cancelOrder(id);
      setOrder(cancelledOrder);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail.map((item) => item.msg).join(", ") : detail || "Couldn't cancel this order");
    } finally {
      setCancelling(false);
    }
  };

  const handleAdvance = async (nextStatus) => {
    setAdvancing(true);
    setError("");
    try {
      await ordersApi.updateOrderStatus(id, nextStatus);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't update order status");
    } finally {
      setAdvancing(false);
    }
  };

  if (!order) return <p className="text-sm text-muted">Loading order…</p>;

  const currentIndex = PIPELINE.indexOf(order.status);
  const isTerminalFailure = order.status === "CANCELLED" || order.status === "PAYMENT_FAILED";
  const canCancel = ["PENDING", "PAYMENT_SUCCESS", "ORDER_CONFIRMED"].includes(order.status);
  const canPay = ["PENDING", "PAYMENT_FAILED"].includes(order.status);
  const nextStep = NEXT_STEP[order.status];

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} className="text-sm text-muted hover:text-ink mb-6">
        ← Back
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="eyebrow mb-2">Workspace / Fulfillment</p>
          <h1 className="font-display text-3xl font-semibold text-ink mb-1">Order detail</h1>
          <p className="font-mono text-sm text-muted">{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {!isTerminalFailure && (
        <div className="surface p-6 mb-6">
          <div className="flex justify-between">
            {PIPELINE.map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div
                    className={`absolute h-px top-2 -left-1/2 w-full ${
                      i <= currentIndex ? "bg-depot" : "bg-line"
                    }`}
                  />
                )}
                <div
                  className={`w-4 h-4 rounded-full border-2 z-10 ${
                    i <= currentIndex ? "bg-depot border-depot" : "bg-paper-raised border-line-strong"
                  }`}
                />
                <span className="text-[10px] font-mono uppercase tracking-wide2 text-muted mt-2 text-center">
                  {step.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">{error}</div>
      )}

      <div className="surface mobile-scroll">
        <div className="ledger-row grid-cols-[1fr_auto_auto] px-5 !border-b-2 !border-line-strong text-xs font-mono uppercase tracking-wide2 text-muted">
          <span>Product</span>
          <span>Qty</span>
          <span>Line total</span>
        </div>
        {order.items.map((item) => (
          <div key={item.id} className="ledger-row grid-cols-[1fr_auto_auto] px-5">
            <div>
              <p className="text-sm text-ink">{item.product.name}</p>
              <p className="text-xs font-mono text-muted">{item.product.sku}</p>
            </div>
            <span className="data-mono text-center">{item.quantity}</span>
            <span className="data-mono text-right">{formatCurrency(Number(item.unit_price) * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between px-5 py-4 border-t-2 border-line-strong">
          <span className="font-display font-medium">Total</span>
          <span className="font-mono text-lg">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6">
        {user?.role === "admin" && nextStep && (
          <button className="btn-secondary" onClick={() => handleAdvance(nextStep)} disabled={advancing}>
            {advancing ? "Updating…" : `Mark as ${nextStep.toLowerCase()}`}
          </button>
        )}
        {canPay && (
          <Link to={`/checkout/${order.id}`} className="btn-primary">
            Complete payment
          </Link>
        )}
        {canCancel && (
          <button className="btn-danger" onClick={handleCancel} disabled={cancelling}>
            <span aria-hidden="true">×</span> {cancelling ? "Cancelling…" : "Cancel order"}
          </button>
        )}
      </div>
    </div>
  );
}
