const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.css') {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// 初始化数据库
let db;
const dbPath = 'likes.db';
initSqlJs().then(SQL => {
    if (!fs.existsSync(dbPath)) {
        db = new SQL.Database();
        db.run("CREATE TABLE likes (imageId TEXT PRIMARY KEY, count INTEGER)");
        db.run("CREATE TABLE user_likes (userId TEXT, imageId TEXT, liked BOOLEAN, PRIMARY KEY (userId, imageId))");
        const data = db.export();
        fs.writeFileSync(dbPath, data);
    } else {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    }
});

// 处理 /likes 路由
app.get('/likes', (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(`Received /likes request for userId: ${userId}`);

        // 同步執行的部分應改為異步，如果可能的話
        const likesResult = db.exec("SELECT * FROM likes");
        const userLikesResult = db.exec(`SELECT * FROM user_likes WHERE userId = ?`, [userId]);

        const likeCounts = likesResult.length ? likesResult[0].values.reduce((acc, row) => {
            acc[row[0]] = row[1];
            return acc;
        }, {}) : {};

        const userLikes = userLikesResult.length ? userLikesResult[0].values.reduce((acc, row) => {
            acc[row[1]] = row[2] === 1;
            return acc;
        }, {}) : {};

        res.json({ likeCounts, userLikes });
        console.log(`Sent response for /likes request: ${JSON.stringify({ likeCounts, userLikes })}`);
    } catch (error) {
        console.error('Error processing /likes request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 处理 /like 路由
app.post('/like', (req, res) => {
    const { userId, imageId, liked } = req.body;
    console.log(`Received /like request with data: ${JSON.stringify(req.body)}`);

    db.run(`INSERT OR REPLACE INTO user_likes (userId, imageId, liked) VALUES (?, ?, ?)`, [userId, imageId, liked]);

    const likeCountResult = db.exec(`SELECT count FROM likes WHERE imageId = ?`, [imageId]);
    let likeCount = likeCountResult.length ? likeCountResult[0].values[0][0] : 0;

    if (liked) {
        likeCount += 1;
    } else {
        likeCount -= 1;
    }

    db.run(`INSERT OR REPLACE INTO likes (imageId, count) VALUES (?, ?)`, [imageId, likeCount]);

    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));

    console.log(`Updated like count for image ${imageId}: ${likeCount}`);
    res.json({ likeCount });
});

// 处理所有其他请求，返回index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'likeindex.html'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
