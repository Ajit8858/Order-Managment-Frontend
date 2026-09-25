import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, onAdd, onBuy, adding }) {
  const outOfStock = product.stock <= 0;

  return (
    <div className="surface flex flex-col group hover:-translate-y-1 transition-transform duration-200">
      <Link to={`/products/${product.id}`} className="p-5 flex-1 block">
        <ProductImage product={product} className="h-36 mb-5">
          <span className="eyebrow">{product.stock > 0 ? "Available" : "Sold out"}</span>
        </ProductImage>
        <p className="text-xs font-mono text-muted mb-2">{product.sku}</p>
        <h3 className="font-display font-medium text-ink leading-snug mb-2">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-muted line-clamp-2">{product.description}</p>
        )}
      </Link>
      <div className="flex items-center justify-between px-5 py-4 border-t border-line bg-white/40">
        <div>
          <p className="font-mono text-base text-ink">{formatCurrency(product.price)}</p>
          <p className="text-xs text-muted mt-0.5">
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs px-3 py-2" disabled={outOfStock || adding} onClick={() => onAdd(product)}>
            Add
          </button>
          <button className="btn-primary text-xs px-3 py-2" disabled={outOfStock || adding} onClick={() => onBuy(product)}>
            {adding ? "Opening…" : "Buy now"}
          </button>
        </div>
      </div>
    </div>
  );
}
