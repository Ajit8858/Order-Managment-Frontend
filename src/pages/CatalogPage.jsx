import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as productsApi from "../api/products";
import * as ordersApi from "../api/orders";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";

const PAGE_SIZE = 12;

export default function CatalogPage() {
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState("");

  const [filters, setFilters] = useState({
    q: "",
    category_id: "",
    sort_by: "created_at",
    sort_dir: "desc",
    page: 1,
  });

  const load = useCallback(async () => {
    const params = {
      page: filters.page,
      page_size: PAGE_SIZE,
      sort_by: filters.sort_by,
      sort_dir: filters.sort_dir,
    };
    if (filters.q) params.q = filters.q;
    if (filters.category_id) params.category_id = filters.category_id;

    const data = await productsApi.listProducts(params);
    setProducts(data);
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    productsApi.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleAdd = async (product) => {
    setAddingId(product.id);
    try {
      await ordersApi.addCartItem(product.id, 1);
      await refreshCart();
      setToast(`Added "${product.name}" to cart`);
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setToast(err.response?.data?.detail || "Couldn't add item to cart");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setAddingId(null);
    }
  };

  const handleBuy = async (product) => {
    setAddingId(product.id);
    try {
      await ordersApi.addCartItem(product.id, 1);
      await refreshCart();
      navigate("/review-order");
    } catch (err) {
      setToast(err.response?.data?.detail || "Couldn't start purchase");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-2">Storefront / {categories.length || 0} categories</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Find your next essential.</h1>
          <p className="text-sm text-muted mt-2">Browse the latest products, curated for quick ordering.</p>
        </div>
        {toast && (
          <div className="border-l-2 border-depot bg-depot-soft text-depot text-sm px-3 py-2">
            {toast}
          </div>
        )}
      </div>

      <div className="surface flex flex-wrap gap-3 mb-8 p-4">
        <input
          className="field-input flex-1 min-w-[200px]"
          placeholder="Search products…"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))}
        />
        <select
          className="field-input w-auto"
          value={filters.category_id}
          onChange={(e) => setFilters((f) => ({ ...f, category_id: e.target.value, page: 1 }))}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="field-input w-auto"
          value={`${filters.sort_by}:${filters.sort_dir}`}
          onChange={(e) => {
            const [sort_by, sort_dir] = e.target.value.split(":");
            setFilters((f) => ({ ...f, sort_by, sort_dir, page: 1 }));
          }}
        >
          <option value="created_at:desc">Newest first</option>
          <option value="price:asc">Price: low to high</option>
          <option value="price:desc">Price: high to low</option>
          <option value="name:asc">Name: A to Z</option>
        </select>
      </div>

      {products === null && <p className="text-sm text-muted">Loading products…</p>}

      {products && products.items.length === 0 && (
        <EmptyState
          title="No products match your search"
          hint="Try a different search term or clear the filters."
        />
      )}

      {products && products.items.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="eyebrow">Showing {products.items.length} of {products.total} products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.items.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={handleAdd} onBuy={handleBuy} adding={addingId === p.id} />
            ))}
          </div>
          <Pagination
            page={products.page}
            pages={products.pages}
            onChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}
    </div>
  );
}
