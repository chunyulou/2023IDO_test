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

let db;

// 初始化数据库
initSqlJs().then(SQL => {
    if (!fs.existsSync('likes.db')) {
        db = new SQL.Database();
        db.run("CREATE TABLE likes (imageId TEXT PRIMARY KEY, count INTEGER)");
        db.run("CREATE TABLE user_likes (userId TEXT, imageId TEXT, liked BOOLEAN, PRIMARY KEY (userId, imageId))");
        const data = db.export();
        fs.writeFileSync('likes.db', data);
    } else {
        const fileBuffer = fs.readFileSync('likes.db');
        db = new SQL.Database(fileBuffer);
    }
});

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
    fs.writeFileSync('likes.db', data);

    res.json({ likeCount });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
