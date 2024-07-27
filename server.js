const express = require('express');
const cors = require('cors');
const db = require('./database'); // 引入数据库
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 获取初始点赞数据
app.get('/initial-data', (req, res) => {
    const userId = req.query.userId;

    db.all("SELECT imageId, count FROM likes", [], (err, likeRows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.all("SELECT imageId, liked FROM user_likes WHERE userId = ?", [userId], (err, userLikeRows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const likeCounts = {};
            likeRows.forEach(row => {
                likeCounts[row.imageId] = row.count;
            });

            const userLikes = {};
            userLikeRows.forEach(row => {
                userLikes[row.imageId] = row.liked;
            });

            res.json({ likeCounts, userLikes });
        });
    });
});

// 更新点赞计数
app.post('/like', (req, res) => {
    const { userId, imageId, liked } = req.body;

    db.get("SELECT count FROM likes WHERE imageId = ?", [imageId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            const newCount = liked ? row.count + 1 : row.count - 1;
            db.run("UPDATE likes SET count = ? WHERE imageId = ?", [newCount, imageId], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                db.run("INSERT OR REPLACE INTO user_likes (userId, imageId, liked) VALUES (?, ?, ?)", [userId, imageId, liked], function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.json({ likeCount: newCount });
                });
            });
        } else {
            const initialCount = liked ? 1 : 0;
            db.run("INSERT INTO likes (imageId, count) VALUES (?, ?)", [imageId, initialCount], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                db.run("INSERT OR REPLACE INTO user_likes (userId, imageId, liked) VALUES (?, ?, ?)", [userId, imageId, liked], function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.json({ likeCount: initialCount });
                });
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
