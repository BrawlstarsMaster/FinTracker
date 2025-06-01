const { Goal } = require('../models');

exports.getAll = async (req, res) => {
  const goals = await Goal.findAll({ where: { userId: req.user.id } });
  res.json(goals);
};

exports.create = async (req, res) => {
  const { title, targetAmount, deadline } = req.body;
  const goal = await Goal.create({ userId: req.user.id, title, targetAmount, deadline });
  res.status(201).json(goal);
};

exports.getById = async (req, res) => {
  const goal = await Goal.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!goal) return res.status(404).json({ message: 'Not found' });
  res.json(goal);
};

exports.update = async (req, res) => {
  const goal = await Goal.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!goal) return res.status(404).json({ message: 'Not found' });
  await goal.update(req.body);
  res.json(goal);
};

exports.remove = async (req, res) => {
  const goal = await Goal.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!goal) return res.status(404).json({ message: 'Not found' });
  await goal.destroy();
  res.json({ message: 'Deleted' });
}; 