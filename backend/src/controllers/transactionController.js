const { Transaction, Category } = require('../models');

exports.getAll = async (req, res) => {
  const transactions = await Transaction.findAll({ where: { userId: req.user.id }, order: [['date', 'DESC']] });
  res.json(transactions);
};

exports.create = async (req, res) => {
  const { type, categoryId, amount, date, description } = req.body;
  let category = '';
  if (categoryId) {
    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(400).json({ message: 'Invalid category' });
    category = cat.name;
  }
  const transaction = await Transaction.create({ userId: req.user.id, type, category, categoryId, amount, date, description });
  res.status(201).json(transaction);
};

exports.getById = async (req, res) => {
  const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!transaction) return res.status(404).json({ message: 'Not found' });
  res.json(transaction);
};

exports.update = async (req, res) => {
  const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!transaction) return res.status(404).json({ message: 'Not found' });
  const { type, categoryId, amount, date, description } = req.body;
  let category = transaction.category;
  if (categoryId) {
    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(400).json({ message: 'Invalid category' });
    category = cat.name;
  }
  await transaction.update({ type, category, categoryId, amount, date, description });
  res.json(transaction);
};

exports.remove = async (req, res) => {
  const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!transaction) return res.status(404).json({ message: 'Not found' });
  await transaction.destroy();
  res.json({ message: 'Deleted' });
}; 