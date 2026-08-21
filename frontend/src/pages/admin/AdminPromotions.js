import { useEffect, useRef, useState } from 'react';
import api from '../../api/api';

const THEMES = [
  { value: 'classic', label: 'Classic — Black & Gold (default)' },
  { value: 'ivory', label: 'Ivory — Light background, dark text' },
  { value: 'emerald', label: 'Emerald — Deep green (e.g. Independence Day)' },
  { value: 'burgundy', label: 'Burgundy — Deep red (e.g. big sale events)' },
  { value: 'gold', label: 'Gold — Warm amber accent' },
];

const emptyForm = {
  title: '', eyebrow: '', description: '', ctaText: 'Shop Now', ctaLink: '/shop',
  placement: 'hero', active: true, startDate: '', endDate: '', order: 0,
  theme: 'classic', backgroundImage: '',
};

// Formats a Date (or ISO string) into the yyyy-mm-dd shape <input type="date"> expects
const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => api.get('/promotions/all').then(({ data }) => setPromotions(data));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Uploads a background photo (same admin-only endpoint used for product
  // photos) and stores the returned URL - when set, this overrides the
  // theme color and shows behind the banner text instead.
  const handleBackgroundUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const { data: res } = await api.post('/upload', data);
      setForm((f) => ({ ...f, backgroundImage: res.imageUrl }));
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
      order: Number(form.order) || 0,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };
    try {
      if (editingId) {
        await api.put(`/promotions/${editingId}`, payload);
      } else {
        await api.post('/promotions', payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save promotion');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      eyebrow: p.eyebrow || '',
      description: p.description || '',
      ctaText: p.ctaText || 'Shop Now',
      ctaLink: p.ctaLink || '/shop',
      placement: p.placement,
      active: p.active,
      startDate: toDateInput(p.startDate),
      endDate: toDateInput(p.endDate),
      order: p.order || 0,
      theme: p.theme || 'classic',
      backgroundImage: p.backgroundImage || '',
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotion permanently?')) return;
    await api.delete(`/promotions/${id}`);
    load();
  };

  const handleToggle = async (id) => {
    await api.patch(`/promotions/${id}/toggle`);
    load();
  };

  // Whether a promotion is actually visible on the site right now, taking
  // its active flag AND its optional date window into account.
  const isLiveNow = (p) => {
    if (!p.active) return false;
    const now = new Date();
    if (p.startDate && new Date(p.startDate) > now) return false;
    if (p.endDate && new Date(p.endDate) < now) return false;
    return true;
  };

  return (
    <div>
      <h1>Promotions</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Manage homepage banners, sale events, and announcements — e.g. an Independence Day sale
        or a limited-time promo. "Hero" slides rotate in the top carousel; "Banner" is the single
        full-width strip further down the homepage.
      </p>

      <div className="form-card" style={{ marginBottom: 32, maxWidth: 640 }}>
        <h2>{editingId ? 'Edit Promotion' : 'Add New Promotion'}</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input
              placeholder="e.g. Independence Day Sale"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Eyebrow (small text above title)</label>
            <input
              placeholder="e.g. Limited Time or 14th August Special"
              value={form.eyebrow}
              onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              placeholder="e.g. Up to 30% off selected styles, this weekend only."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Button Text</label>
              <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
            </div>
            <div className="field">
              <label>Button Link</label>
              <input
                placeholder="/shop or /shop?category=Sneakers"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Placement</label>
              <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
                <option value="hero">Hero Carousel (top of homepage)</option>
                <option value="banner">Promo Banner (mid-page strip)</option>
              </select>
            </div>
            <div className="field">
              <label>Hero Order (lower shows first)</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Theme</label>
            <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
              {THEMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <p style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
              Sets the background color and text contrast for this specific banner/slide.
            </p>
          </div>

          <div className="field">
            <label>Background Image (optional)</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleBackgroundUpload} />
            {uploading && <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Uploading...</p>}
            {form.backgroundImage && (
              <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
                <img src={form.backgroundImage} alt="background preview" style={{ width: 220, border: '1px solid #eee' }} />
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: 10, marginLeft: 10 }}
                  onClick={() => setForm({ ...form, backgroundImage: '' })}
                >
                  Remove
                </button>
              </div>
            )}
            <p style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
              When set, this photo shows behind the banner (with a dark overlay for readable
              text) instead of the flat theme color above.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Start Date (optional)</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="field">
              <label>End Date (optional)</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#888', marginTop: -12, marginBottom: 18 }}>
            Leave dates blank to run indefinitely, or set a window (e.g. Aug 8–16) so it
            automatically stops showing without you needing to switch it off by hand.
          </p>

          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              style={{ width: 'auto' }}
            />
            <label htmlFor="active" style={{ margin: 0 }}>Active</label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" disabled={uploading}>{editingId ? 'Save Changes' : 'Add Promotion'}</button>
            {editingId && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th><th>Placement</th><th>Theme</th><th>Schedule</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((p) => (
            <tr key={p._id}>
              <td>
                <strong>{p.title}</strong>
                {p.eyebrow && <><br /><span style={{ fontSize: 11, color: '#888' }}>{p.eyebrow}</span></>}
              </td>
              <td style={{ textTransform: 'capitalize' }}>{p.placement}</td>
              <td style={{ textTransform: 'capitalize' }}>{p.theme || 'classic'}</td>
              <td style={{ fontSize: 12 }}>
                {p.startDate || p.endDate
                  ? `${p.startDate ? toDateInput(p.startDate) : '…'} – ${p.endDate ? toDateInput(p.endDate) : '…'}`
                  : 'Always on'}
              </td>
              <td>
                <span className={`pill ${isLiveNow(p) ? 'pill-delivered' : 'pill-pending'}`}>
                  {isLiveNow(p) ? 'Live' : p.active ? 'Scheduled / Expired' : 'Off'}
                </span>
              </td>
              <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => handleToggle(p._id)}>
                  {p.active ? 'Turn Off' : 'Turn On'}
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

export default AdminPromotions;
