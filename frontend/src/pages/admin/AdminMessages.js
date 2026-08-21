import { useEffect, useState } from 'react';
import api from '../../api/api';

// Admin-only: GET /api/messages is protected by (protect, adminOnly) on the
// backend, so contact-form submissions are never visible to regular users.
const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  const load = () => api.get('/messages').then(({ data }) => setMessages(data));
  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id) => {
    await api.patch(`/messages/${id}/read`);
    load();
  };

  return (
    <div>
      <h1>Messages</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>Messages submitted through the Contact page.</p>
      <table>
        <thead>
          <tr><th>From</th><th>Subject</th><th>Message</th><th>Status</th><th>Received</th><th></th></tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m._id}>
              <td>{m.name}<br /><span style={{ color: '#888', fontSize: 11 }}>{m.email}</span></td>
              <td>{m.subject}</td>
              <td style={{ maxWidth: 320 }}>{m.message}</td>
              <td><span className={`pill ${m.read ? 'pill-read' : 'pill-unread'}`}>{m.read ? 'Read' : 'Unread'}</span></td>
              <td>{new Date(m.createdAt).toLocaleDateString()}</td>
              <td>
                {!m.read && (
                  <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => handleMarkRead(m._id)}>
                    Mark Read
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMessages;
