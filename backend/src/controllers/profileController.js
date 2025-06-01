const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const { name, currency } = req.body;
  await user.update({ name, currency });
  res.json({ message: 'Profile updated' });
};

exports.changePassword = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const { oldPassword, newPassword } = req.body;
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(400).json({ message: 'Old password incorrect' });
  const hash = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hash });
  res.json({ message: 'Password changed' });
}; 