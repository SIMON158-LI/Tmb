const sqlite3 = require('sqlite3').verbose();

// 自动生成 tmb.db 数据库文件
const db = new sqlite3.Database('./tmb.db', (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('✅ 成功连接到 TMB 数据库！');
  }
});

// 创建用户表（存储账号、昵称等信息）
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL,
  password TEXT NOT NULL,
  gender TEXT,
  age INTEGER,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('创建用户表失败:', err.message);
  } else {
    console.log('✅ 用户表创建完成！');
  }
});

module.exports = db;