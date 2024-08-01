const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 处理public目录下的静态文件

const dbPath = path.resolve(__dirname, 'likes.db');

initSqlJs().then(SQL => {
    let db;

    // 如果不存在数据库文件，则创建一个新的数据库文件
    if (!fs.existsSync(dbPath)) {
        db = new SQL.Database();
        db.run("CREATE TABLE likes (imageId TEXT PRIMARY KEY, count INTEGER)");
        db.run("CREATE TABLE user_likes (userId TEXT, imageId TEXT, liked BOOLEAN, PRIMARY KEY (userId, imageId))");
        const data = db.export();
        fs.writeFileSync(dbPath, Buffer.from(data));
    } else {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(new Uint8Array(fileBuffer));
    }

    // 处理 /likes 路由
    app.get('/likes', (req, res) => {
        const userId = req.query.userId;
        const likesResult = db.exec("SELECT * FROM likes");
        const userLikesResult = db.exec(`SELECT * FROM user_likes WHERE userId='${userId}'`);

        const likeCounts = likesResult.length ? likesResult[0].values.reduce((acc, row) => {
            acc[row[0]] = row[1];
            return acc;
        }, {}) : {};

        const userLikes = userLikesResult.length ? userLikesResult[0].values.reduce((acc, row) => {
            acc[row[1]] = row[2] === 1;
            return acc;
        }, {}) : {};

        res.json({ likeCounts, userLikes });
    });

    // 处理 /like 路由
    app.post('/like', (req, res) => {
        const { userId, imageId, liked } = req.body;

        db.run(`INSERT OR REPLACE INTO user_likes (userId, imageId, liked) VALUES ('${userId}', '${imageId}', ${liked})`);

        const likeCountResult = db.exec(`SELECT count FROM likes WHERE imageId='${imageId}'`);
        let likeCount = likeCountResult.length ? likeCountResult[0].values[0][0] : 0;

        if (liked) {
            likeCount += 1;
        } else {
            likeCount -= 1;
        }

        db.run(`INSERT OR REPLACE INTO likes (imageId, count) VALUES ('${imageId}', ${likeCount})`);

        const data = db.export();
        fs.writeFileSync(dbPath, Buffer.from(data));

        res.json({ likeCount });
    });

    // 处理所有其他请求，返回index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    });

    // 启动服务器
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
