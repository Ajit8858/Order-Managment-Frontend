import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as productsApi from "../api/products";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", description: "", price: "", stock: "", sku: "", category_id: "" };

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    productsApi.listCategories()
      .then(setCategories)
      .catch((err) => setError(err.response?.data?.detail || "Couldn't load categories"));
  }, []);

  useEffect(() => {
    if (isEdit) {
      productsApi.getProduct(id).then((p) => {
        setForm({
          name: p.name,
          description: p.description || "",
          price: p.price,
          stock: p.stock,
          sku: p.sku,
          category_id: p.category_id || "",
        });
      }).catch((err) => setError(err.response?.data?.detail || "Couldn't load product"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setAddingCategory(true);
    setError("");
    try {
      const category = await productsApi.createCategory({ name: newCategory.trim() });
      setCategories((prev) => [...prev, category]);
      setForm((f) => ({ ...f, category_id: category.id }));
      setNewCategory("");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail.map((item) => item.msg).join(", ") : detail || "Couldn't create category");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: form.price,
        stock: Number(form.stock),
        category_id: form.category_id || null,
      };
      if (isEdit) {
        await productsApi.updateProduct(id, payload);
      } else {
        await productsApi.createProduct({ ...payload, sku: form.sku });
      }
      navigate("/admin/products");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail.map((item) => item.msg).join(", ") : detail || "Couldn't save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <p className="eyebrow mb-2">Operations / Inventory</p>
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">
        {isEdit ? "Edit product" : "New product"}
      </h1>
      <p className="text-sm text-muted mb-8">Set the details customers will see in the catalog.</p>

      <form onSubmit={handleSubmit} className="surface p-6">
        {error && (
          <div className="mb-4 border-l-2 border-alarm bg-alarm-soft px-3 py-2 text-sm text-alarm">{error}</div>
        )}
        {loading && <div className="mb-4 border-l-2 border-amber bg-amber-soft px-3 py-2 text-sm text-ink">Loading product details…</div>}

        <div className="mb-4">
          <label className="field-label">Name</label>
          <input
            required
            className="field-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="field-label">Description</label>
          <textarea
            rows={3}
            className="field-input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="field-label">Price (INR)</label>
            <input
              required
              type="number"
              step="0.01"
              min="0.01"
              className="field-input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Stock</label>
            <input
              required
              type="number"
              min="0"
              className="field-input"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>

        {!isEdit && (
          <div className="mb-4">
            <label className="field-label">SKU</label>
            <input
              required
              className="field-input font-mono"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="SKU-0001"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="field-label">Category</label>
          <select
            className="field-input mb-2"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {user?.role === "admin" ? (
            <div className="flex gap-2">
              <input
                className="field-input flex-1"
                placeholder="Add new category…"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button type="button" className="btn-secondary text-sm" onClick={handleAddCategory} disabled={addingCategory}>
                {addingCategory ? "Adding…" : "Add"}
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted">Only administrators can create categories.</p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving || loading}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}
