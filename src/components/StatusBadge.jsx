const STATUS_STYLES = {
  PENDING: "border-amber text-ink bg-amber-soft",
  PAYMENT_SUCCESS: "border-depot text-depot bg-depot-soft",
  PAYMENT_FAILED: "border-alarm text-alarm bg-alarm-soft",
  ORDER_CONFIRMED: "border-depot text-depot bg-depot-soft",
  SHIPPED: "border-ink text-ink bg-paper-raised",
  DELIVERED: "border-depot text-depot bg-depot-soft",
  CANCELLED: "border-muted text-muted bg-paper-raised",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  PAYMENT_SUCCESS: "Paid",
  PAYMENT_FAILED: "Payment failed",
  ORDER_CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "border-line-strong text-muted bg-paper-raised";
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border-l-2 px-2.5 py-1 text-xs font-mono uppercase tracking-wide2 ${style}`}
    >
      {label}
    </span>
  );
}
