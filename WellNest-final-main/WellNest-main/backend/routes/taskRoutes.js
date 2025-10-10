const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Get or create today's tasks
router.get('/', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    let task = await Task.findOne({ date: today });
    if (!task) {
      const defaultTasks = [
        { description: 'Drink water', completed: false },
        { description: 'Exercise', completed: false },
        { description: 'Meditate', completed: false },
        { description: 'Eat healthy', completed: false },
        { description: 'Sleep 8 hours', completed: false },
        { description: 'Talk to a friend', completed: false },
        { description: 'Read a book', completed: false },
        { description: 'Take a break', completed: false },
        { description: 'Practice gratitude', completed: false },
        { description: 'Avoid negative thoughts', completed: false }
      ];
      task = new Task({ date: today, tasks: defaultTasks });
      await task.save();
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task completion status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { taskIndex, completed } = req.body;
  try {
    const task = await Task.findById(id);
    task.tasks[taskIndex].completed = completed;
    const completedTasks = task.tasks.filter(t => t.completed).length;
    task.completionPercentage = (completedTasks / task.tasks.length) * 100;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;