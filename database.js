const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // 使用内存中的数据库，也可以改为文件数据库，例如 'likes.db'

// 初始化数据库并创建表
db.serialize(() => {
    db.run("CREATE TABLE likes (imageId TEXT PRIMARY KEY, count INTEGER)");
    db.run("CREATE TABLE user_likes (userId TEXT, imageId TEXT, liked BOOLEAN, PRIMARY KEY (userId, imageId))");
});

module.exports = db;
