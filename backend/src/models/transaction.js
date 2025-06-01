const { DataTypes } = require('sequelize');
module.exports = { Transaction: (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: true },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    type: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    currency: { type: DataTypes.STRING, allowNull: true },
  });
  return Transaction;
}}; 