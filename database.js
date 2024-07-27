// 导入 sql.js
const initSqlJs = require('sql.js');
const fs = require('fs'); // 用于文件操作

// 初始化 SQL.js
initSqlJs().then(SQL => {
    // 创建一个数据库实例
    const db = new SQL.Database();

    // 创建表
    db.run("CREATE TABLE IF NOT EXISTS likes (imageId TEXT PRIMARY KEY, count INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS user_likes (userId TEXT, imageId TEXT, liked BOOLEAN, PRIMARY KEY (userId, imageId))");

    // 你可以将数据库保存到文件系统
    // 这里假设数据库将被保存为 'database.sqlite'
    const filebuffer = db.export();
    fs.writeFileSync('database.sqlite', new Buffer.from(filebuffer));

    // 如果需要从文件加载数据库
    // const filebuffer = fs.readFileSync('database.sqlite');
    // const db = new SQL.Database(new Uint8Array(filebuffer));
}).catch(err => {
    console.error('Error initializing SQL.js:', err);
});
