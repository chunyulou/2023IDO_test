const initSqlJs = require('sql.js');
let db;

// 初始化数据库并创建表
initSqlJs().then(SQL => {
    db = new SQL.Database();
    db.run("CREATE TABLE likes (imageId TEXT PRIMARY KEY, count INTEGER)");
    db.run("CREATE TABLE user_likes (userId TEXT, imageId TEXT, liked BOOLEAN, PRIMARY KEY (userId, imageId))");

    // 这里添加你的其他服务器配置和路由
    const express = require('express');
    const app = express();
    const cors = require('cors');

    app.use(cors());
    app.use(express.json());

    // 例如，定义一个获取 likes 的端点
    app.get('/likes', (req, res) => {
        const result = db.exec("SELECT * FROM likes");
        res.json(result);
    });

    // 启动服务器
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
