// 导入 sql.js
const initSqlJs = require('sql.js');
const fs = require('fs');

// 初始化 SQL.js
initSqlJs().then(SQL => {
    const db = new SQL.Database();

    // 创建表
    db.run("CREATE TABLE IF NOT EXISTS likes (imageId TEXT PRIMARY KEY, count INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS user_likes (userId TEXT, imageId TEXT, liked BOOLEAN, PRIMARY KEY (userId, imageId))");

    // 示例：插入数据
    db.run("INSERT INTO likes (imageId, count) VALUES (?, ?)", ['image1', 10]);

    // 查询数据
    const result = db.exec("SELECT * FROM likes");
    console.log(result);
}).catch(err => {
    console.error('Error initializing SQL.js:', err);
});
