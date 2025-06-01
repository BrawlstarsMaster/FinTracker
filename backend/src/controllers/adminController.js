const { User, Category } = require('../models');

exports.listUsers = async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'currency', 'active'] });
  res.json(users);
};

// Placeholder for generating reports
exports.generateReports = async (req, res) => {
  // TODO: Implement report generation logic
  res.status(200).json({ message: 'Report generation endpoint - To be implemented' });
};

exports.deactivateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  await user.update({ active: false });
  res.json({ message: 'User deactivated' });
};

exports.reactivateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  await user.update({ active: true });
  res.json({ message: 'User reactivated' });
};

// Category management
exports.listCategories = async (req, res) => {
  const categories = await Category.findAll({ where: { userId: null } });
  res.json(categories);
};
exports.addCategory = async (req, res) => {
  const { name, type } = req.body;
  const category = await Category.create({ name, type, userId: null });
  res.status(201).json(category);
};
exports.removeCategory = async (req, res) => {
  const category = await Category.findOne({ where: { id: req.params.id, userId: null } });
  if (!category) return res.status(404).json({ message: 'Not found' });
  await category.destroy();
  res.json({ message: 'Deleted' });
}; 