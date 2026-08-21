import { useEffect, useRef, useState } from 'react';
import api from '../../api/api';
import { formatPKR } from '../../utils/format';

const AVAILABLE_IMAGES = ['/images/shoe1.svg', '/images/shoe2.svg', '/images/shoe3.svg', '/images/shoe4.svg', '/images/shoe5.svg', '/images/shoe6.svg'];
const CATEGORIES = ['Sneakers', 'Running', 'Boots', 'Formal', 'Sandals'];

const emptyForm = {
  name: '', description: '', price: '', compareAtPrice: '', category: 'Sneakers',
  image: AVAILABLE_IMAGES[0], sizes: '7,8,9,10', stock: 10, featured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => api.get('/products').then(({ data }) => setProducts(data));

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Uploads the chosen file to the backend (admin-only route) and drops
  // the returned URL straight into the image field, replacing whatever
  // preset was selected.
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const { data: res } = await api.post('/upload', data);
      setForm((f) => ({ ...f, image: res.imageUrl }));
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock),
      sizes: form.sizes.split(',').map((s) => Number(s.trim())).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice || '',
      category: p.category,
      image: p.image,
      sizes: p.sizes.join(','),
      stock: p.stock,
      featured: !!p.featured,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  // Quick one-click toggle - this is the "put or sold out" control the
  // admin can use without opening the full edit form.
  const handleToggleSoldOut = async (id) => {
    await api.patch(`/products/${id}/sold-out`);
    load();
  };

  return (
    <div>
      <h1>Products</h1>

      <div className="form-card" style={{ marginBottom: 32, maxWidth: 640 }}>
        <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Price (PKR)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="field">
              <label>Compare-at Price (optional)</label>
              <input type="number" step="0.01" min="0" placeholder="e.g. original price before sale" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Sizes (comma separated)</label>
            <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
          </div>

          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              style={{ width: 'auto' }}
            />
            <label htmlFor="featured" style={{ margin: 0 }}>Show in "Featured" section on Home page</label>
          </div>

          <div className="field">
            <label>Upload Product Photo</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} />
            {uploading && <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Uploading...</p>}
          </div>

          <div className="field">
            <label>Or Use a Built-in Illustration</label>
            <select
              value={AVAILABLE_IMAGES.includes(form.image) ? form.image : ''}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            >
              <option value="" disabled>— select —</option>
              {AVAILABLE_IMAGES.map((img) => <option key={img} value={img}>{img}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Preview</label>
            <img src={form.image} alt="preview" style={{ width: 160, border: '1px solid #eee', padding: 6, background: '#fff' }} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" disabled={uploading}>{editingId ? 'Save Changes' : 'Add Product'}</button>
            {editingId && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={p.image} alt={p.name} /></td>
              <td>{p.name}</td>
              <td>
                {formatPKR(p.price)}
                {p.compareAtPrice > p.price && (
                  <><br /><span style={{ textDecoration: 'line-through', color: '#999', fontSize: 11 }}>{formatPKR(p.compareAtPrice)}</span></>
                )}
              </td>
              <td>{p.stock}</td>
              <td>
                <span className={`pill ${p.soldOut ? 'pill-cancelled' : 'pill-delivered'}`}>
                  {p.soldOut ? 'Sold Out' : 'In Stock'}
                </span>
              </td>
              <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => handleToggleSoldOut(p._id)}>
                  {p.soldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                </button>
                <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
