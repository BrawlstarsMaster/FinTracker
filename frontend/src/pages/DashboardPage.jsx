import React, { useEffect, useState, useContext, useCallback } from 'react';
import { client, batchRequest } from '../api/client';
import { AuthContext } from '../contexts/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ type: 'expense', categoryId: '', amount: '', date: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = useCallback(async () => {
    try {
      // Batch the API calls
      const [transactionsRes, categoriesRes] = await Promise.all([
        batchRequest('transactions', () => client.get('/transactions')),
        batchRequest('categories', () => client.get('/categories'))
      ]);

      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);

      const bal = transactionsRes.data.reduce((acc, t) => 
        t.type === 'income' ? acc + parseFloat(t.amount) : acc - parseFloat(t.amount), 0);
      setBalance(bal);

      // Prepare chart data
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const income = Array(12).fill(0);
      const expense = Array(12).fill(0);
      transactionsRes.data.forEach(t => {
        const m = new Date(t.date).getMonth();
        if (t.type === 'income') income[m] += parseFloat(t.amount);
        else expense[m] += parseFloat(t.amount);
      });
      setChartData({
        labels: months.map(m => `${m}`),
        datasets: [
          { label: 'Приходи', data: income, backgroundColor: 'rgba(34,197,94,0.7)' },
          { label: 'Разходи', data: expense, backgroundColor: 'rgba(239,68,68,0.7)' },
        ],
      });
    } catch (err) {
      setError('Грешка при зареждане на транзакции');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await client.post('/transactions', form);
      setForm({ type: 'expense', categoryId: '', amount: '', date: '', description: '' });
      setSuccess('Транзакцията е добавена!');
      setError('');
      await fetchData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Transaction add error:', err, err.response?.data);
      if (err.response && err.response.data && err.response.data.message) {
        setError('Грешка: ' + err.response.data.message);
      } else {
        setError('Грешка при добавяне на транзакция');
      }
      setSuccess('');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Добре дошъл, {user?.name}!</h1>
      <div className="mb-6 flex gap-4 flex-col md:flex-row">
        <div className="bg-green-100 text-green-800 rounded p-4 flex-1">
          <div className="text-lg">Текущ баланс</div>
          <div className="text-2xl font-bold">{balance.toFixed(2)} {user?.currency || 'USD'}</div>
        </div>
        <div className="bg-blue-100 text-blue-800 rounded p-4 flex-1">
          <div className="text-lg mb-2">Графика по месеци</div>
          <div className="h-48 flex items-center justify-center">
            {chartData ? (
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            ) : (
              <span>Зареждане...</span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Добави транзакция</h2>
        <form onSubmit={handleAdd} className="flex gap-2 flex-wrap mb-2">
          <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
            <option value="income">Приход</option>
            <option value="expense">Разход</option>
          </select>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Избери категория</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="amount" value={form.amount} onChange={handleChange} placeholder="Сума" type="number" className="border p-2 rounded" required />
          <input name="date" value={form.date} onChange={handleChange} placeholder="Дата" type="date" className="border p-2 rounded" required />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Описание" className="border p-2 rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Добави</button>
        </form>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-500 mb-2 text-center">{success}</div>}
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Последни транзакции</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Категория</th>
              <th>Тип</th>
              <th>Сума</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map(t => (
              <tr key={t.id} className="border-t">
                <td>{t.date}</td>
                <td>{t.category}</td>
                <td>{t.type}</td>
                <td>{t.amount} {t.currency}</td>
                <td>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage; 