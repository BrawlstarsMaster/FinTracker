import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatsPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('/api/transactions').then(res => setTransactions(res.data));
  }, []);

  // Expenses by category
  const expenses = transactions.filter(t => t.type === 'expense');
  const categories = [...new Set(expenses.map(e => e.category))];
  const expensesByCategory = categories.map(cat =>
    expenses.filter(e => e.category === cat).reduce((sum, e) => sum + parseFloat(e.amount), 0)
  );

  // Income/Expenses by month
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const incomeByMonth = months.map(m =>
    transactions.filter(t => t.type === 'income' && new Date(t.date).getMonth() + 1 === m)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  );
  const expenseByMonth = months.map(m =>
    transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() + 1 === m)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Статистики</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Разходи по категории</h2>
        <Pie data={{
          labels: categories,
          datasets: [{
            data: expensesByCategory,
            backgroundColor: [
              '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#facc15', '#38bdf8', '#818cf8', '#f472b6'
            ]
          }]
        }} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Приходи и разходи по месеци</h2>
        <Bar data={{
          labels: months.map(m => `${m} месец`),
          datasets: [
            { label: 'Приходи', data: incomeByMonth, backgroundColor: 'rgba(34,197,94,0.7)' },
            { label: 'Разходи', data: expenseByMonth, backgroundColor: 'rgba(239,68,68,0.7)' }
          ]
        }} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
};

export default StatsPage; 