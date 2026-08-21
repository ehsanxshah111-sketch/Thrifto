import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div className="admin-shell">
    <aside className="admin-sidebar">
      <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
      <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>Products</NavLink>
      <NavLink to="/admin/promotions" className={({ isActive }) => (isActive ? 'active' : '')}>Promotions</NavLink>
      <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>Orders</NavLink>
      <NavLink to="/admin/messages" className={({ isActive }) => (isActive ? 'active' : '')}>Messages</NavLink>
      <NavLink to="/admin/activity-log" className={({ isActive }) => (isActive ? 'active' : '')}>Activity Log</NavLink>
    </aside>
    <main className="admin-main">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
