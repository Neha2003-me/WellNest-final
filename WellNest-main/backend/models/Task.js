const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  tasks: [{
    description: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  completionPercentage: { type: Number, default: 0 }
});

module.exports = mongoose.model('Task', taskSchema);