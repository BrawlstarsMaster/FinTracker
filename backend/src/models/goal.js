const { DataTypes } = require('sequelize');
module.exports = { Goal: (sequelize) => {
  const Goal = sequelize.define('Goal', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    targetAmount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    currentAmount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    deadline: { type: DataTypes.DATEONLY, allowNull: false },
  });
  return Goal;
}}; 