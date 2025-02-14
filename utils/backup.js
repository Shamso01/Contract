const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

const backupData = async () => {
  try {
    const Expense = mongoose.model('Expense');
    const data = await Expense.find({});
    
    const backupPath = path.join(__dirname, '../backups');
    const fileName = `backup-${new Date().toISOString().split('T')[0]}.json`;
    
    await fs.mkdir(backupPath, { recursive: true });
    await fs.writeFile(
      path.join(backupPath, fileName),
      JSON.stringify(data, null, 2)
    );
    
    console.log('✅ تم إنشاء نسخة احتياطية بنجاح');
  } catch (error) {
    console.error('❌ خطأ في النسخ الاحتياطي:', error);
  }
};

module.exports = { backupData };
