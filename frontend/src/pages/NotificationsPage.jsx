import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
      setSuccess('Известията са заредени успешно!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError('Грешка: ' + err.response.data.message);
      } else {
        setError('Грешка при зареждане на известия');
      }
      setTimeout(() => setError(''), 3000);
    }
    setLoading(false);
  };

  const markRead = async (id) => {
    setError(''); setSuccess('');
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
      setSuccess('Известието е отбелязано като прочетено!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError('Грешка: ' + err.response.data.message);
      } else {
        setError('Грешка при отбелязване като прочетено');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  const remove = async (id) => {
    setError(''); setSuccess('');
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(n => n.filter(notif => notif.id !== id));
      setSuccess('Известието е изтрито!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError('Грешка: ' + err.response.data.message);
      } else {
        setError('Грешка при изтриване на известие');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchNews = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.post('/api/notifications/fetch-finance-news');
      setSuccess('Новините са обновени!');
      await fetchNotifications();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Грешка при обновяване на новините');
      setTimeout(() => setError(''), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={fetchNews} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">{loading ? 'Обновяване...' : 'Обнови новини'}</button>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      {success && <div className="text-green-500 mb-2 text-center">{success}</div>}
      <div className="space-y-2">
        {notifications.length === 0 && <div>Няма известия.</div>}
        {notifications.map(n => (
          <div key={n.id} className={`p-4 rounded shadow flex justify-between items-center ${n.read ? 'bg-gray-100' : 'bg-yellow-100'}`}>
            <div>
              <div className="font-semibold">{n.type}</div>
              <div>{n.message}</div>
              <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              {!n.read && <button onClick={() => markRead(n.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Прочети</button>}
              <button onClick={() => remove(n.id)} className="bg-red-500 text-white px-2 py-1 rounded">Изтрий</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage; 