export default function EmptyState({ title, hint, action }) {
  return (
    <div className="border border-dashed border-line-strong py-16 px-8 text-center">
      <p className="font-display text-lg text-ink mb-1">{title}</p>
      {hint && <p className="text-sm text-muted mb-4">{hint}</p>}
      {action}
    </div>
  );
}
