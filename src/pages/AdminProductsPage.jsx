import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import * as productsApi from "../api/products";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/currency";

export default function AdminProductsPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const result = await productsApi.listProducts({ page, page_size: 15, sort_by: "created_at", sort_dir: "desc" });
    setData(result);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDeactivate = async (product) => {
    if (!window.confirm(`Deactivate "${product.name}"? It will no longer be visible in the catalog.`)) return;
    try {
      await productsApi.deleteProduct(product.id);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't deactivate product");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-2">Operations / Product management</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Inventory control</h1>
          <p className="text-sm text-muted mt-2">Keep the catalog accurate, available, and ready to ship.</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          New product
        </Link>
      </div>

      {error && (
        <div className="mb-4 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">{error}</div>
      )}

      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="surface p-4"><p className="eyebrow">Listed</p><p className="font-display text-2xl mt-2">{data.total}</p></div>
          <div className="surface p-4"><p className="eyebrow">On this page</p><p className="font-display text-2xl mt-2">{data.items.length}</p></div>
          <div className="surface p-4 col-span-2 sm:col-span-1"><p className="eyebrow">View</p><p className="font-display text-2xl mt-2">Live stock</p></div>
        </div>
      )}

      {!data && <p className="text-sm text-muted">Loading…</p>}

      {data && data.items.length === 0 && (
        <EmptyState
          title="No products yet"
          hint="Create your first product to start selling."
          action={
            <Link to="/admin/products/new" className="btn-primary">
              New product
            </Link>
          }
        />
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="surface mobile-scroll">
            <div className="ledger-row grid-cols-[1fr_auto_auto_auto_auto] px-5 !border-b-2 !border-line-strong text-xs font-mono uppercase tracking-wide2 text-muted">
              <span>Product</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
              <span></span>
            </div>
            {data.items.map((p) => (
              <div key={p.id} className="ledger-row grid-cols-[1fr_auto_auto_auto_auto] px-5">
                <div>
                  <p className="text-sm text-ink font-medium">{p.name}</p>
                  <p className="text-xs font-mono text-muted mt-0.5">{p.sku}</p>
                </div>
                <span className="data-mono">{formatCurrency(p.price)}</span>
                <span className="data-mono">{p.stock}</span>
                <span className={`text-xs font-mono uppercase ${p.is_active ? "text-depot" : "text-muted"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2 justify-end">
                  <Link to={`/admin/products/${p.id}/edit`} className="btn-edit" aria-label={`Edit ${p.name}`}>
                    <span aria-hidden="true">✎</span> Edit
                  </Link>
                  {p.is_active && (
                    <button
                      onClick={() => handleDeactivate(p)}
                      className="btn-remove"
                      aria-label={`Deactivate ${p.name}`}
                    >
                      <span aria-hidden="true">×</span> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
