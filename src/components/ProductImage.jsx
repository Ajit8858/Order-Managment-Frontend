export default function ProductImage({ product, className = "", children }) {
  const initial = product?.name?.slice(0, 1).toUpperCase() || "P";

  return (
    <div className={`product-image relative overflow-hidden bg-amber-soft ${className}`}>
      {product?.image_url ? (
        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0 opacity-50 product-image-grid" />
          <span className="relative flex h-full items-end p-4 font-display text-5xl font-semibold text-ink/15">{initial}</span>
          <span className="absolute right-3 top-3 text-[10px] font-mono uppercase tracking-wide2 text-ink/45">Product image</span>
        </>
      )}
      {children}
    </div>
  );
}
