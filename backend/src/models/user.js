const { DataTypes } = require('sequelize');
module.exports = { User: (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USD' },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
  return User;
}}; 