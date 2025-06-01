import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ category: '', type: '', date: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ type: 'expense', categoryId: '', amount: '', date: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      setError('Грешка при зареждане на транзакции');
    }
  };

  useEffect(() => {
    fetchTransactions();
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, []);

  const filtered = transactions.filter(t =>
    (!filter.category || t.category.toLowerCase().includes(filter.category.toLowerCase())) &&
    (!filter.type || t.type === filter.type) &&
    (!filter.date || t.date === filter.date)
  );

  const startEdit = (t) => { setEditId(t.id); setEditForm({ ...t, categoryId: t.categoryId || '' }); setError(''); setSuccess(''); };
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSave = async (id) => {
    setError(''); setSuccess('');
    try {
      await axios.put(`/api/transactions/${id}`, editForm);
      setEditId(null);
      await fetchTransactions();
      setSuccess('Транзакцията е редактирана!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Грешка при редакция');
      setTimeout(() => setError(''), 3000);
    }
  };
  const handleEditCancel = () => { setEditId(null); setEditForm({}); };
  const handleDelete = async (id) => {
    setError(''); setSuccess('');
    try {
      await axios.delete(`/api/transactions/${id}`);
      await fetchTransactions();
      setSuccess('Транзакцията е изтрита!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Грешка при изтриване');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddChange = e => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/transactions', addForm);
      setAddForm({ type: 'expense', categoryId: '', amount: '', date: '', description: '' });
      setAddOpen(false);
      await fetchTransactions();
      setSuccess('Транзакцията е добавена!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Грешка при добавяне');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Всички транзакции</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} placeholder="Категория" className="border p-2 rounded" />
        <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))} className="border p-2 rounded">
          <option value="">Всички</option>
          <option value="income">Приход</option>
          <option value="expense">Разход</option>
        </select>
        <input value={filter.date} onChange={e => setFilter(f => ({ ...f, date: e.target.value }))} type="date" className="border p-2 rounded" />
        <button onClick={() => setAddOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Добави</button>
      </div>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      {success && <div className="text-green-500 mb-2 text-center">{success}</div>}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>Дата</th><th>Категория</th><th>Тип</th><th>Сума</th><th>Описание</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-t">
                {editId === t.id ? (
                  <Modal open={editId === t.id} onClose={handleEditCancel} title="Редактирай транзакция">
                    <form onSubmit={e => { e.preventDefault(); handleEditSave(t.id); }} className="flex flex-col gap-2">
                      <input name="date" value={editForm.date} onChange={handleEditChange} type="date" className="border p-2 rounded" required />
                      <select name="categoryId" value={editForm.categoryId} onChange={handleEditChange} className="border p-2 rounded" required>
                        <option value="">Избери категория</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <select name="type" value={editForm.type} onChange={handleEditChange} className="border p-2 rounded">
                        <option value="income">Приход</option>
                        <option value="expense">Разход</option>
                      </select>
                      <input name="amount" value={editForm.amount} onChange={handleEditChange} type="number" className="border p-2 rounded" required />
                      <input name="description" value={editForm.description} onChange={handleEditChange} placeholder="Описание" className="border p-2 rounded" />
                      <div className="flex gap-2 justify-end">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Запази</button>
                        <button type="button" onClick={handleEditCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Отказ</button>
                      </div>
                    </form>
                  </Modal>
                ) : (
                  <>
                    <td>{t.date}</td>
                    <td>{t.category}</td>
                    <td>{t.type === 'income' ? 'Приход' : 'Разход'}</td>
                    <td>{t.amount} {t.currency || ''}</td>
                    <td>{t.description}</td>
                    <td>
                      <button onClick={() => startEdit(t)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-1">Редактирай</button>
                      <button onClick={() => handleDelete(t.id)} className="bg-red-500 text-white px-2 py-1 rounded">Изтрий</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добави транзакция">
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <input name="date" value={addForm.date} onChange={handleAddChange} type="date" className="border p-2 rounded" required />
          <select name="categoryId" value={addForm.categoryId} onChange={handleAddChange} className="border p-2 rounded" required>
            <option value="">Избери категория</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="type" value={addForm.type} onChange={handleAddChange} className="border p-2 rounded">
            <option value="income">Приход</option>
            <option value="expense">Разход</option>
          </select>
          <input name="amount" value={addForm.amount} onChange={handleAddChange} type="number" className="border p-2 rounded" required />
          <input name="description" value={addForm.description} onChange={handleAddChange} placeholder="Описание" className="border p-2 rounded" />
          <div className="flex gap-2 justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Добави</button>
            <button type="button" onClick={() => setAddOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Отказ</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TransactionsPage; 