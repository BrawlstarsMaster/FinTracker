import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecurringPage = () => {
  const [recurring, setRecurring] = useState([]);
  const [form, setForm] = useState({ type: 'expense', category: '', amount: '', startDate: '', frequency: 'monthly', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchRecurring = async () => {
    try {
      const res = await axios.get('/api/recurring');
      setRecurring(res.data);
    } catch (err) {
      setError('Грешка при зареждане на повтарящи се транзакции');
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/recurring', form);
      setForm({ type: 'expense', category: '', amount: '', startDate: '', frequency: 'monthly', description: '' });
      await fetchRecurring();
      setSuccess('Успешно добавена повтаряща се транзакция!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Грешка при добавяне');
      setTimeout(() => setError(''), 3000);
    }
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setEditForm({ ...r });
    setError(''); setSuccess('');
  };

  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSave = async (id) => {
    setError(''); setSuccess('');
    try {
      await axios.put(`/api/recurring/${id}`, editForm);
      setEditId(null);
      await fetchRecurring();
      setSuccess('Успешно редактирано!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Грешка при редакция');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({});
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Повтарящи се транзакции</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6 flex-wrap">
        <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
          <option value="income">Приход</option>
          <option value="expense">Разход</option>
        </select>
        <input name="category" value={form.category} onChange={handleChange} placeholder="Категория" className="border p-2 rounded" required />
        <input name="amount" value={form.amount} onChange={handleChange} placeholder="Сума" type="number" className="border p-2 rounded" required />
        <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="Начална дата" type="date" className="border p-2 rounded" required />
        <select name="frequency" value={form.frequency} onChange={handleChange} className="border p-2 rounded">
          <option value="daily">Дневно</option>
          <option value="weekly">Седмично</option>
          <option value="monthly">Месечно</option>
          <option value="yearly">Годишно</option>
        </select>
        <input name="description" value={form.description} onChange={handleChange} placeholder="Описание" className="border p-2 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Добави</button>
      </form>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {success && <div className="text-green-500 mb-4 text-center">{success}</div>}
      <div className="space-y-4">
        {recurring.map(r => (
          <div key={r.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
            {editId === r.id ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2 flex-wrap">
                  <select name="type" value={editForm.type} onChange={handleEditChange} className="border p-2 rounded">
                    <option value="income">Приход</option>
                    <option value="expense">Разход</option>
                  </select>
                  <input name="category" value={editForm.category} onChange={handleEditChange} placeholder="Категория" className="border p-2 rounded" required />
                  <input name="amount" value={editForm.amount} onChange={handleEditChange} placeholder="Сума" type="number" className="border p-2 rounded" required />
                  <input name="startDate" value={editForm.startDate} onChange={handleEditChange} placeholder="Начална дата" type="date" className="border p-2 rounded" required />
                  <select name="frequency" value={editForm.frequency} onChange={handleEditChange} className="border p-2 rounded">
                    <option value="daily">Дневно</option>
                    <option value="weekly">Седмично</option>
                    <option value="monthly">Месечно</option>
                    <option value="yearly">Годишно</option>
                  </select>
                  <input name="description" value={editForm.description} onChange={handleEditChange} placeholder="Описание" className="border p-2 rounded" />
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEditSave(r.id)} className="bg-green-500 text-white px-3 py-1 rounded">Запази</button>
                  <button onClick={handleEditCancel} className="bg-gray-400 text-white px-3 py-1 rounded">Отказ</button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div><b>{r.category}</b> ({r.type})</div>
                  <div>Сума: {r.amount}</div>
                  <div>Честота: {r.frequency}</div>
                  <div>От: {r.startDate}</div>
                  <div>{r.description}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-500 mb-2">{r.active ? 'Активна' : 'Неактивна'}</div>
                  <button onClick={() => startEdit(r)} className="bg-yellow-500 text-white px-3 py-1 rounded">Редактирай</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringPage; 