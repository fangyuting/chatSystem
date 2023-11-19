const db = require('../utils/connectDB');
const { pyqLike } = require('../models/pyqLike');
const { pyqNews } = require('../models/pyqNews');
const { createToken, parseToken } = require('../utils/authorization');

// 点赞
const doLike = async (req, res) => {
    if (parseToken(req.headers.authorization) == null) {
        return res.json({
            status: 1006,
            data: [],
            msg: 'Token 已过期'
        });
    } else if (parseToken(req.headers.authorization) == 'errToken') {
        return res.json({
            status: 1006,
            data: [],
            msg: 'Token 无效'
        });
    }
    // console.log(req.body);
    const { authorId, pyqId } = req.body;
    const existingLike = await pyqLike.findOne({
        where: {
            authorId: authorId,
            pyqId: pyqId
        }
    });
    // console.log('existingLike', existingLike);
    if (existingLike) {
        res.json({
            status: 1003,
            msg: '已经点过赞了!'
        });
    } else {
        const like = await pyqLike.create({
            authorId: authorId,
            pyqId: pyqId,
            createDate: Date.now() + 8 * 3600000
        });
        // console.log(like);
        const likedUser = await pyqNews.findOne({ where: { id: pyqId } });
        // console.log('likedUser.likes', likedUser.likes);
        const newLike = +likedUser.likes + 1;

        await pyqNews.update({ likes: newLike }, { where: { id: pyqId } });
        res.json({
            status: 200,
            msg: 'doLike success'
        });
    }
};

module.exports = {
    doLike
};
