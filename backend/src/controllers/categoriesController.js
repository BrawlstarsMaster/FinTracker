const { Category } = require('../models');
const { Op } = require('sequelize');

const getAll = async (req, res) => {
  const categories = await Category.findAll({
    where: {
      [Op.or]: [
        { userId: null },
        { userId: req.user.id }
      ]
    }
  });
  res.json(categories);
};

const add = async (req, res) => {
  const { name, type } = req.body;
  const category = await Category.create({ name, type, userId: req.user.id });
  res.status(201).json(category);
};

const update = async (req, res) => {
  const category = await Category.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!category) return res.status(404).json({ message: 'Not found' });
  await category.update(req.body);
  res.json(category);
};

const remove = async (req, res) => {
  const category = await Category.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!category) return res.status(404).json({ message: 'Not found' });
  await category.destroy();
  res.json({ message: 'Deleted' });
};

const express = require('express');
const router = express.Router();

router.get('/', getAll);
router.post('/', add);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router; 