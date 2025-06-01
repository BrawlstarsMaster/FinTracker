const { DataTypes } = require('sequelize');
module.exports = { Category: (sequelize) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true }, // null = глобална
  });
  return Category;
}}; 