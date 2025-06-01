import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [message, setMessage] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleProfile = async (e) => {
    e.preventDefault();
    await axios.put('/api/profile', { name, currency });
    setMessage('Профилът е обновен!');
    setUser && setUser({ ...user, name, currency });
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    await axios.put('/api/profile/password', { oldPassword, newPassword });
    setMessage('Паролата е сменена!');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Профил</h1>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <form onSubmit={handleProfile} className="bg-white p-4 rounded shadow mb-6">
        <div className="mb-2">
          <label className="block mb-1">Име</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Валута</label>
          <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border p-2 rounded">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BGN">BGN</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Запази</button>
      </form>
      <form onSubmit={handlePassword} className="bg-white p-4 rounded shadow">
        <div className="mb-2">
          <label className="block mb-1">Стара парола</label>
          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Нова парола</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Смени паролата</button>
      </form>
    </div>
  );
};

export default ProfilePage; 