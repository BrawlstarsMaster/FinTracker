import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TABS = ['Потребители', 'Категории', 'Audit Log'];

const AdminPage = () => {
  const [tab, setTab] = useState(TABS[0]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (tab === 'Потребители') {
      axios.get('/api/admin/users').then(res => setUsers(res.data));
    } else if (tab === 'Категории') {
      axios.get('/api/admin/categories').then(res => setCategories(res.data));
    } else if (tab === 'Audit Log') {
      axios.get('/api/audit-logs').then(res => setLogs(res.data));
    }
  }, [tab]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Админ панел</h1>
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{t}</button>
        ))}
      </div>
      {tab === 'Потребители' && (
        <table className="w-full bg-white rounded shadow mb-6">
          <thead>
            <tr>
              <th>ID</th><th>Име</th><th>Email</th><th>Роля</th><th>Валута</th><th>Активен</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.currency}</td><td>{u.active ? 'Да' : 'Не'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === 'Категории' && (
        <table className="w-full bg-white rounded shadow mb-6">
          <thead>
            <tr>
              <th>ID</th><th>Име</th><th>Тип</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t">
                <td>{c.id}</td><td>{c.name}</td><td>{c.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === 'Audit Log' && (
        <table className="w-full bg-white rounded shadow mb-6 text-xs">
          <thead>
            <tr>
              <th>ID</th><th>User</th><th>Action</th><th>Entity</th><th>EntityId</th><th>Changes</th><th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-t">
                <td>{l.id}</td><td>{l.User?.email}</td><td>{l.action}</td><td>{l.entity}</td><td>{l.entityId}</td><td><pre>{JSON.stringify(l.changes, null, 1)}</pre></td><td>{l.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage; 