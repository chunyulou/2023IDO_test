const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 處理 public 目錄下的靜態文件

const dbPath = path.resolve(__dirname, 'likes.db');

initSqlJs().then(SQL => {
    let db;

    // 如果不存在數據庫文件，則創建一個新的數據庫文件
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

    // 處理 /likes 路由
    app.get('/likes', (req, res) => {
        const userId = req.query.userId;
        const likesStmt = db.prepare("SELECT * FROM likes");
        const userLikesStmt = db.prepare("SELECT * FROM user_likes WHERE userId = ?");
        userLikesStmt.bind([userId]);

        const likesResult = likesStmt.getAsObject({});
        const userLikesResult = userLikesStmt.getAsObject({});

        const likeCounts = {};
        if (likesResult) {
            likeCounts[likesResult.imageId] = likesResult.count;
        }

        const userLikes = {};
        if (userLikesResult) {
            userLikes[userLikesResult.imageId] = userLikesResult.liked === 1;
        }

        res.json({ likeCounts, userLikes });
    });

    // 處理 /like 路由
    app.post('/like', (req, res) => {
        const { userId, imageId, liked } = req.body;

        // 使用參數化查詢更新用戶的喜歡狀態
        const updateUserLikeStmt = db.prepare("INSERT OR REPLACE INTO user_likes (userId, imageId, liked) VALUES (?, ?, ?)");
        updateUserLikeStmt.run([userId, imageId, liked]);

        // 使用參數化查詢更新該圖片的喜歡計數
        const selectLikeCountStmt = db.prepare("SELECT count FROM likes WHERE imageId = ?");
        selectLikeCountStmt.bind([imageId]);
        let likeCountResult = selectLikeCountStmt.getAsObject({});

        let likeCount = likeCountResult.count || 0;

        if (liked) {
            likeCount += 1;
        } else {
            likeCount -= 1;
        }

        const updateLikeCountStmt = db.prepare("INSERT OR REPLACE INTO likes (imageId, count) VALUES (?, ?)");
        updateLikeCountStmt.run([imageId, likeCount]);

        const data = db.export();
        fs.writeFileSync(dbPath, Buffer.from(data));

        res.json({ likeCount });
    });

    // 處理所有其他請求，返回 index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'likeindex.html'));
    });

    // 啟動伺服器
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });


});
