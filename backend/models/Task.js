const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    status: { type: String, default: 'to-do' }, // 'to-do', 'in-progress', 'done'
});

module.exports = mongoose.model('Task', TaskSchema);
