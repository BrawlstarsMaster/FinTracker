const { Budget, Category, Transaction } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  const budgets = await Budget.findAll({ where: { userId: req.user.id } });
  res.json(budgets);
};

exports.create = async (req, res) => {
  const { categoryId, amount, month, year, currency } = req.body;
  let category = '';
  if (categoryId) {
    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(400).json({ message: 'Invalid category' });
    category = cat.name;
  }
  const budget = await Budget.create({ userId: req.user.id, category, categoryId, amount, month, year, currency });
  res.status(201).json(budget);
};

exports.getById = async (req, res) => {
  const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!budget) return res.status(404).json({ message: 'Not found' });
  res.json(budget);
};

exports.update = async (req, res) => {
  const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!budget) return res.status(404).json({ message: 'Not found' });
  const { categoryId, amount, month, year, currency } = req.body;
  let category = budget.category;
  if (categoryId) {
    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(400).json({ message: 'Invalid category' });
    category = cat.name;
  }
  await budget.update({ category, categoryId, amount, month, year, currency });
  res.json(budget);
};

exports.remove = async (req, res) => {
  const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!budget) return res.status(404).json({ message: 'Not found' });
  await budget.destroy();
  res.json({ message: 'Deleted' });
};

// Get usage for a budget (total spent in category/month/year)
exports.getUsage = async (req, res) => {
  const { categoryId, month, year } = req.query;
  const where = {
    userId: req.user.id,
    type: 'expense',
    date: {
      [Op.gte]: `${year}-${month}-01`,
      [Op.lte]: `${year}-${month}-31`,
    },
  };
  if (categoryId && categoryId !== 'null' && !isNaN(Number(categoryId))) {
    where.categoryId = categoryId;
  }
  const usage = await Transaction.sum('amount', { where });
  res.json({ usage: usage || 0 });
}; 