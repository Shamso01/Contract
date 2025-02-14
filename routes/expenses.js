const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// إحصائيات شهرية
router.get('/stats/monthly', async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $group: {
        _id: '$month',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        categories: { $push: '$category' }
      }},
      { $sort: { _id: -1 }}
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تصدير البيانات
router.get('/export', async (req, res) => {
  try {
    const { month } = req.query;
    const data = await Expense.find({ month })
      .select('-__v')
      .sort({ date: 1 });
      
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
