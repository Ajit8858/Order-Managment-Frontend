import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import * as ordersApi from "../api/orders";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/currency";

export default function OrdersPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const result = await ordersApi.listOrders({ page, page_size: 10 });
    setData(result);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  if (!data) return <p className="text-sm text-muted">Loading orders…</p>;

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-2">Workspace / Fulfillment</p>
        <h1 className="font-display text-3xl font-semibold text-ink">Order history</h1>
        <p className="text-sm text-muted mt-2">Track every purchase from payment to delivery.</p>
      </div>

      {data.items.length === 0 ? (
        <EmptyState
          title="No orders yet"
          hint="Orders you place will show up here."
          action={
            <Link to="/" className="btn-primary">
              Browse catalog
            </Link>
          }
        />
      ) : (
        <div className="surface mobile-scroll">
          <div className="ledger-row grid-cols-[1fr_auto_auto_auto] px-5 !border-b-2 !border-line-strong text-xs font-mono uppercase tracking-wide2 text-muted">
            <span>Order</span>
            <span>Placed</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {data.items.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="ledger-row grid-cols-[1fr_auto_auto_auto] px-5 hover:bg-paper transition-colors"
            >
              <span className="data-mono text-ink truncate pr-4">{order.id}</span>
              <span className="text-sm text-muted">{new Date(order.created_at).toLocaleDateString()}</span>
              <span className="data-mono text-ink">{formatCurrency(order.total_amount)}</span>
              <StatusBadge status={order.status} />
            </Link>
          ))}
        </div>
      )}

      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
