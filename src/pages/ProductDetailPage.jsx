import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as productsApi from "../api/products";
import * as ordersApi from "../api/orders";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import ProductImage from "../components/ProductImage";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    productsApi
      .getProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true));
  }, [id]);

  const handleAdd = async () => {
    setStatus("adding");
    try {
      await ordersApi.addCartItem(product.id, quantity);
      await refreshCart();
      setStatus("added");
    } catch (err) {
      setStatus(err.response?.data?.detail || "error");
    }
  };

  const handleBuy = async () => {
    setStatus("buying");
    try {
      await ordersApi.addCartItem(product.id, quantity);
      await refreshCart();
      navigate("/review-order");
    } catch (err) {
      setStatus(err.response?.data?.detail || "Couldn't start purchase");
    }
  };

  if (notFound) {
    return (
      <div>
        <p className="text-sm text-muted mb-4">This product doesn't exist or was removed.</p>
        <Link to="/" className="btn-secondary">
          Back to catalog
        </Link>
      </div>
    );
  }

  if (!product) return <p className="text-sm text-muted">Loading…</p>;

  const outOfStock = product.stock <= 0;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} className="text-sm text-muted hover:text-ink mb-6">
        ← Back
      </button>

      <div className="surface p-6 sm:p-8">
        <ProductImage product={product} className="h-56 mb-7" />
        <p className="text-xs font-mono text-muted mb-3">{product.sku}</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-3">{product.name}</h1>
        {product.description && <p className="text-sm text-muted leading-relaxed mb-6">{product.description}</p>}

        <div className="flex items-end justify-between border-t border-line pt-6">
          <div>
            <p className="font-mono text-2xl text-ink">{formatCurrency(product.price)}</p>
            <p className="text-sm text-muted mt-1">
              {outOfStock ? "Out of stock" : `${product.stock} available`}
            </p>
          </div>

          {!outOfStock && (
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                className="field-input w-20 text-center"
              />
              <button className="btn-secondary" onClick={handleAdd} disabled={status === "adding" || status === "buying"}>
                {status === "adding" ? "Adding…" : "Add to cart"}
              </button>
              <button className="btn-primary" onClick={handleBuy} disabled={status === "adding" || status === "buying"}>
                {status === "buying" ? "Opening cart…" : "Buy now"}
              </button>
            </div>
          )}
        </div>

        {status === "added" && (
          <p className="mt-4 text-sm text-depot border-l-2 border-depot bg-depot-soft px-3 py-2">
            Added to cart.{" "}
            <Link to="/cart" className="underline underline-offset-2">
              View cart
            </Link>
          </p>
        )}
        {status && status !== "added" && status !== "adding" && status !== "buying" && (
          <p className="mt-4 text-sm text-alarm border-l-2 border-alarm bg-alarm-soft px-3 py-2">{status}</p>
        )}
      </div>
    </div>
  );
}
