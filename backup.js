const cron = require('node-cron');
const { MongoClient } = require('mongodb');

// نسخ احتياطي يومي
cron.schedule('0 0 * * *', async () => {
  // كود النسخ الاحتياطي
});
