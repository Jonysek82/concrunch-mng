const mongoose = require('mongoose');

const auditEntrySchema = new mongoose.Schema({
  actorId: { type: String, required: true, index: true },
  actorRole: { type: String, required: true },
  action: { type: String, required: true, index: true },
  entityType: { type: String, required: true, index: true },
  entityId: { type: String, default: '' },
  changedFields: [{ type: String }],
  requestId: { type: String, required: true }
}, { timestamps: { createdAt: 'occurredAt', updatedAt: false } });

auditEntrySchema.index({ occurredAt: -1 });

module.exports = mongoose.model('AuditEntry', auditEntrySchema);
