require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
require('./cron/financeNewsJob');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api-docs', require('swagger-ui-express').serve, require('swagger-ui-express').setup(require('../swagger.json')));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 