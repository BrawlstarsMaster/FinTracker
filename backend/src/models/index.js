require('dotenv').config();

const { Sequelize } = require('sequelize');
const { User } = require('./user');
const { Transaction } = require('./transaction');
const { Goal } = require('./goal');
const { RecurringTransaction } = require('./recurringTransaction');
const { Notification } = require('./notification');
const { Budget } = require('./budget');
const { AuditLog } = require('./auditLog');
const { Category } = require('./category');
console.log("DB config:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS, typeof process.env.DB_PASS);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
  }
);


const UserModel = User(sequelize);
const TransactionModel = Transaction(sequelize);
const GoalModel = Goal(sequelize);
const RecurringTransactionModel = RecurringTransaction(sequelize);
const NotificationModel = Notification(sequelize);
const BudgetModel = Budget(sequelize);
const AuditLogModel = AuditLog(sequelize);
const CategoryModel = Category(sequelize);

UserModel.hasMany(TransactionModel, { foreignKey: 'userId' });
TransactionModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserModel.hasMany(GoalModel, { foreignKey: 'userId' });
GoalModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserModel.hasMany(RecurringTransactionModel, { foreignKey: 'userId' });
RecurringTransactionModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserModel.hasMany(NotificationModel, { foreignKey: 'userId' });
NotificationModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserModel.hasMany(BudgetModel, { foreignKey: 'userId' });
BudgetModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserModel.hasMany(AuditLogModel, { foreignKey: 'userId' });
AuditLogModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserModel.hasMany(CategoryModel, { foreignKey: 'userId' });
CategoryModel.belongsTo(UserModel, { foreignKey: 'userId' });
TransactionModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });
BudgetModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  User: UserModel,
  Transaction: TransactionModel,
  Goal: GoalModel,
  RecurringTransaction: RecurringTransactionModel,
  Notification: NotificationModel,
  Budget: BudgetModel,
  AuditLog: AuditLogModel,
  Category: CategoryModel,
}; 