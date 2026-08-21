import { useEffect, useState } from 'react';
import api from '../../api/api';

// Admin-only: GET /api/activity-logs is protected by (protect, adminOnly)
// on the backend. Every admin action (products, orders, promotions, and
// admin logins) writes a row here automatically - nothing needs to be
// turned on, this page just reads what's already being recorded.
const MODULES = ['All', 'Auth', 'Products', 'Orders', 'Promotions'];

const AdminActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('All');

  const load = (mod) => {
    setLoading(true);
    const params = mod && mod !== 'All' ? { module: mod } : {};
    api.get('/activity-logs', { params })
      .then(({ data }) => setLogs(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(moduleFilter); }, [moduleFilter]);

  return (
    <div>
      <h1>Activity Log</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Every change made in the admin panel - who made it, what changed, and which device and IP it came from.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {MODULES.map((m) => (
          <button
            key={m}
            className={m === moduleFilter ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ padding: '6px 14px', fontSize: 11 }}
            onClick={() => setModuleFilter(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#888' }}>Loading…</p>
      ) : logs.length === 0 ? (
        <p style={{ color: '#888' }}>No activity recorded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Admin</th>
              <th>Module</th>
              <th>Action</th>
              <th>Details</th>
              <th>Device</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td>{log.user}</td>
                <td><span className="pill pill-pending">{log.module || '—'}</span></td>
                <td>{log.action}</td>
                <td style={{ maxWidth: 320 }}>{log.details}</td>
                <td style={{ fontSize: 12, color: '#666' }}>{log.device || 'Unknown device'}</td>
                <td style={{ fontSize: 12, color: '#666' }}>{log.ip || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminActivityLog;
