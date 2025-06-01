import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'expense' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Грешка при зареждане на категории');
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/categories', form);
      setForm({ name: '', type: 'expense' });
      setAddOpen(false);
      await fetchCategories();
      setSuccess('Категорията е добавена!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Грешка при добавяне');
      setTimeout(() => setError(''), 3000);
    }
  };
  const startEdit = (c) => { setEditId(c.id); setEditForm({ ...c }); setError(''); setSuccess(''); };
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSave = async (id) => {
    setError(''); setSuccess('');
    try {
      await axios.put(`/api/categories/${id}`, editForm);
      setEditId(null);
      await fetchCategories();
      setSuccess('Категорията е редактирана!');
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
      await axios.delete(`/api/categories/${id}`);
      await fetchCategories();
      setSuccess('Категорията е изтрита!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Грешка при изтриване');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Категории</h1>
      <button onClick={() => setAddOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">+ Добави категория</button>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      {success && <div className="text-green-500 mb-2 text-center">{success}</div>}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>Име</th><th>Тип</th><th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t">
                {editId === c.id ? (
                  <Modal open={editId === c.id} onClose={handleEditCancel} title="Редактирай категория">
                    <form onSubmit={e => { e.preventDefault(); handleEditSave(c.id); }} className="flex flex-col gap-2">
                      <input name="name" value={editForm.name} onChange={handleEditChange} className="border p-2 rounded" required />
                      <select name="type" value={editForm.type} onChange={handleEditChange} className="border p-2 rounded">
                        <option value="expense">Разход</option>
                        <option value="income">Приход</option>
                      </select>
                      <div className="flex gap-2 justify-end">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Запази</button>
                        <button type="button" onClick={handleEditCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Отказ</button>
                      </div>
                    </form>
                  </Modal>
                ) : (
                  <>
                    <td>{c.name}</td>
                    <td>{c.type === 'income' ? 'Приход' : 'Разход'}</td>
                    <td>
                      <button onClick={() => startEdit(c)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-1">Редактирай</button>
                      <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-2 py-1 rounded">Изтрий</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Добави категория">
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Име" className="border p-2 rounded" required />
          <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
            <option value="expense">Разход</option>
            <option value="income">Приход</option>
          </select>
          <div className="flex gap-2 justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Добави</button>
            <button type="button" onClick={() => setAddOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Отказ</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesPage; 