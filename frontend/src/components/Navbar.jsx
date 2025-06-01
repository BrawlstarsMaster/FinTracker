import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Link to="/" className="font-bold text-blue-700">FinTrack</Link>
          <Link to="/budgets" className="hover:underline">Бюджети</Link>
          <Link to="/recurring" className="hover:underline">Повтарящи</Link>
          <Link to="/notifications" className="hover:underline">Известия</Link>
          <Link to="/profile" className="hover:underline">Профил</Link>
          <Link to="/transactions" className="hover:underline">Транзакции</Link>
          <Link to="/stats" className="hover:underline">Статистики</Link>
          <Link to="/categories" className="hover:underline">Категории</Link>
          {user.role === 'admin' && <Link to="/admin" className="hover:underline">Админ</Link>}
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Изход</button>
      </div>
    </nav>
  );
};

export default Navbar; 