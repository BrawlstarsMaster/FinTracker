const { RecurringTransaction, Transaction } = require('../models');

exports.getAll = async (req, res) => {
  const recurringTransactions = await RecurringTransaction.findAll({ where: { userId: req.user.id } });
  res.json(recurringTransactions);
};

exports.create = async (req, res) => {
  const { type, category, amount, startDate, frequency, description } = req.body;
  const recurringTransaction = await RecurringTransaction.create({ userId: req.user.id, type, category, amount, startDate, frequency, description });
  res.status(201).json(recurringTransaction);
};

exports.getById = async (req, res) => {
  const recurringTransaction = await RecurringTransaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!recurringTransaction) return res.status(404).json({ message: 'Not found' });
  res.json(recurringTransaction);
};

exports.update = async (req, res) => {
  const recurringTransaction = await RecurringTransaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!recurringTransaction) return res.status(404).json({ message: 'Not found' });
  await recurringTransaction.update(req.body);
  res.json(recurringTransaction);
};

exports.remove = async (req, res) => {
  const recurringTransaction = await RecurringTransaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!recurringTransaction) return res.status(404).json({ message: 'Not found' });
  await recurringTransaction.destroy();
  res.json({ message: 'Deleted' });
};

exports.triggerDue = async (req, res) => {
  res.status(200).json({ message: 'Trigger Due Recurring Transactions endpoint - To be implemented' });
}; 