import { useState } from 'react';
import api from '../api/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await api.post('/messages', form);
      setStatus({ ok: true, text: 'Message sent — we\u2019ll get back to you soon.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ ok: false, text: err.response?.data?.message || 'Could not send message' });
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Contact Thrifto</h2>
        {status && (
          <div className={status.ok ? 'form-success' : 'form-error'}>{status.text}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Subject</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <button className="btn btn-primary btn-block">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
