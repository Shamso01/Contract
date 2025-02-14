const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true,
    index: true // تحسين للبحث
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0 // منع القيم السالبة
  },
  category: { 
    type: String, 
    required: true,
    enum: ['طعام', 'فواتير', 'تسوق', 'صحة', 'نقل', 'أخرى'] // التحقق من الفئات
  },
  description: String,
  billType: String,
  originalAmount: {
    type: Number,
    min: 0
  },
  originalCurrency: {
    type: String,
    enum: ['IQD', 'TRY']
  },
  month: { // إضافة حقل للشهر للأرشفة
    type: String,
    required: true,
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
}, {
  timestamps: true // إضافة updatedAt
});

// إنشاء الفهارس المركبة
expenseSchema.index({ month: 1, category: 1 });
expenseSchema.index({ date: 1, amount: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
