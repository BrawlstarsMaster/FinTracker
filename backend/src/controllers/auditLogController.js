const { AuditLog, User } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  const { userId, entity } = req.query;
  const where = {};
  if (userId) where.userId = userId;
  if (entity) where.entity = entity;
  const logs = await AuditLog.findAll({ where, include: [{ model: User, attributes: ['id', 'name', 'email'] }], order: [['createdAt', 'DESC']] });
  res.json(logs);
}; 