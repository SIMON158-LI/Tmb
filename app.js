const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

// 首页测试接口
app.get('/', (req, res) => {
  res.send('🎉 TMB 社交软件后端服务启动成功！');
});

// 1. 用户注册接口（已完成）
app.post('/api/register', (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password) {
    return res.status(400).json({ error: '昵称和密码不能为空' });
  }
  db.run(
    `INSERT INTO users (nickname, password) VALUES (?, ?)`,
    [nickname, password],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: '✅ 注册成功！',
        userId: this.lastID,
        nickname: nickname
      });
    }
  );
});

// 2. 新增：用户登录接口（核心功能）
app.post('/api/login', (req, res) => {
  const { nickname, password } = req.body;
  
  // 查询数据库中是否有这个用户
  db.get(`SELECT * FROM users WHERE nickname = ? AND password = ?`, [nickname, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: '❌ 账号或密码错误' });
    }
    // 登录成功
    res.json({
      message: '✅ 登录成功！',
      userId: user.id,
      nickname: user.nickname
    });
  });
});

// 启动服务
app.listen(port, () => {
  console.log(`🚀 服务运行在 http://localhost:${port}`);
});