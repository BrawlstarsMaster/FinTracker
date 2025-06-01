const cron = require('node-cron');
const axios = require('axios');
const { Notification, User } = require('../models');

async function fetchFinanceNewsJob() {
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
    console.log(`[FinanceNewsJob] Added ${news.length} news for ${users.length} users.`);
  } catch (err) {
    console.error('[FinanceNewsJob] Error:', err.message);
  }
}

cron.schedule('0,30 * * * *', fetchFinanceNewsJob);

module.exports = fetchFinanceNewsJob; 