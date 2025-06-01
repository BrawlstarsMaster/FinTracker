const { Transaction, Budget, Category } = require('../models');
const { Op } = require('sequelize');

async function migrateCategoryIds() {
  const transactions = await Transaction.findAll();
  for (const t of transactions) {
    if (!t.categoryId && t.category) {
      const cat = await Category.findOne({
        where: {
          name: t.category,
          [Op.or]: [
            { userId: t.userId },
            { userId: null }
          ]
        }
      });
      if (cat) {
        t.categoryId = cat.id;
        await t.save();
      }
    }
  }

  const budgets = await Budget.findAll();
  for (const b of budgets) {
    if (!b.categoryId && b.category) {
      const cat = await Category.findOne({
        where: {
          name: b.category,
          [Op.or]: [
            { userId: b.userId },
            { userId: null }
          ]
        }
      });
      if (cat) {
        b.categoryId = cat.id;
        await b.save();
      }
    }
  }
  console.log('Migration complete!');
}

if (require.main === module) {
  migrateCategoryIds().then(() => process.exit(0));
}

module.exports = migrateCategoryIds; 