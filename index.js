const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const cron = require('node-cron');
const Expense = require('./models/Expense');
const { backupData } = require('./utils/backup');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}));
app.use(express.json());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد الطلبات لكل IP
}));

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ تم الاتصال بقاعدة البيانات'))
  .catch(err => console.error('❌ خطأ في الاتصال:', err));

// إضافة جدولة النسخ الاحتياطي
cron.schedule('0 0 * * *', backupData); // كل يوم في الساعة 12 ليلاً

// API Routes
app.get('/api/expenses', async (req, res) => {
  try {
    const { month, category } = req.query;
    const query = {};
    
    if (month) query.month = month;
    if (category) query.category = category;
    
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(100); // تحديد عدد النتائج
      
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف المصروف بنجاح' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});
