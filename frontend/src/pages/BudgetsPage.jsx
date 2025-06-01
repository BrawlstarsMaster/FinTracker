import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [usage, setUsage] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const fetchBudgets = async () => {
    try {
      const res = await axios.get('/api/budgets');
      setBudgets(res.data);
    } catch (err) {
      setError('Грешка при зареждане на бюджети');
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('/api/budgets', { categoryId, amount, month, year, currency });
      setCategoryId(''); setAmount(''); setMonth(''); setYear('');
      await fetchBudgets();
      setSuccess('Бюджетът е добавен!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError('Грешка: ' + err.response.data.message);
      } else {
        setError('Грешка при добавяне на бюджет');
      }
      setSuccess('');
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchUsage = async (b) => {
    try {
      const res = await axios.get(`/api/budgets/usage?categoryId=${b.categoryId}&month=${b.month}&year=${b.year}`);
      setUsage(u => ({ ...u, [b.id]: res.data.usage }));
    } catch (err) {
      // ignore usage errors for now
    }
  };

  useEffect(() => {
    budgets.forEach(b => fetchUsage(b));
    // eslint-disable-next-line
  }, [budgets.length]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Бюджети</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="border p-2 rounded" required>
          <option value="">Избери категория</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Сума" type="number" className="border p-2 rounded" required />
        <input value={month} onChange={e => setMonth(e.target.value)} placeholder="Месец (1-12)" type="number" className="border p-2 rounded" required />
        <input value={year} onChange={e => setYear(e.target.value)} placeholder="Година" type="number" className="border p-2 rounded" required />
        <select value={currency} onChange={e => setCurrency(e.target.value)} className="border p-2 rounded">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="BGN">BGN</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Добави</button>
      </form>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      {success && <div className="text-green-500 mb-2 text-center">{success}</div>}
      <div className="space-y-4">
        {budgets.map(b => (
          <div key={b.id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between mb-2">
              <div><b>{b.category}</b> ({b.month}/{b.year})</div>
              <div>{usage[b.id] !== undefined ? `${usage[b.id]} / ${b.amount} ${b.currency}` : '...'}</div>
            </div>
            <div className="w-full bg-gray-200 rounded h-3">
              <div className="bg-green-500 h-3 rounded" style={{ width: usage[b.id] ? Math.min(100, (usage[b.id] / b.amount) * 100) + '%' : '0%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetsPage; 