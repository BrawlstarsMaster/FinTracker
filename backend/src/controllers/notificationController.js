const { Notification, User } = require('../models');
const axios = require('axios');

exports.getAll = async (req, res) => {
  const notifications = await Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
  res.json(notifications);
};

exports.markRead = async (req, res) => {
  const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!notification) return res.status(404).json({ message: 'Not found' });
  await notification.update({ read: true });
  res.json(notification);
};

exports.remove = async (req, res) => {
  const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!notification) return res.status(404).json({ message: 'Not found' });
  await notification.destroy();
  res.json({ message: 'Deleted' });
};

exports.fetchFinanceNews = async (req, res) => {
  try {
    
    const newsRes = await axios.get('https://financialmodelingprep.com/api/v3/stock_news?limit=5&apikey=GhcWkPGbSQ53Lt3IViMl8vQZ3t34Hbog');
    const news = newsRes.data;
    const users = await User.findAll();
    for (const article of news) {
      for (const user of users) {
        await Notification.create({
          userId: user.id,
          type: 'finance_news',
          message: article.title,
          description: article.text || article.site || '',
          read: false
        });
      }
    }
    res.json({ message: 'Finance news notifications created', count: news.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news', error: err.message });
  }
}; 