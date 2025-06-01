const { DataTypes } = require('sequelize');
module.exports = { RecurringTransaction: (sequelize) => {
  const RecurringTransaction = sequelize.define('RecurringTransaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    frequency: { type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'), allowNull: false },
    description: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  });
  return RecurringTransaction;
}}; 