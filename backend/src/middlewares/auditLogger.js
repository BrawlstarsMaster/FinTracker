const { AuditLog } = require('../models');

module.exports = (entity) => async (req, res, next) => {
  const userId = req.user?.id;
  const entityId = req.params.id;
  const action = req.method;
  const changes = req.body;
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) && userId) {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId: entityId || 0,
      changes,
    });
  }
  next();
}; 