export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-line pt-4 mt-2">
      <span className="text-xs font-mono text-muted">
        Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button
          className="btn-compact border-line-strong text-ink bg-white hover:border-ink hover:bg-paper"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <span aria-hidden="true">←</span> Previous
        </button>
        <button
          className="btn-compact border-line-strong text-ink bg-white hover:border-ink hover:bg-paper"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
