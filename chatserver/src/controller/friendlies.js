const db = require('../utils/connectDB');
const { Friendly } = require('../models/friendlies');
const { createToken, parseToken } = require('../utils/authorization');

// 添加好友
const addFriend = async (data) => {
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
    // console.log('addFriend');
    // console.log(data);
    const { reveiverId, senderId } = data;

    try {
        const existingUser = await Friendly.findOne({
            where: {
                userM: senderId,
                userY: reveiverId
            }
        });
        if (!existingUser) {
            const newFriend = await Friendly.create({
                userM: senderId,
                userY: reveiverId,
                createDate: Date.now() + 8 * 3600000
            });
            // console.log(newFriend);
        } else {
            console.log('已经是好友了');
        }
    } catch (error) {
        console.error('Error occurred during the query:', error);
    }
};

// 获取好友列表
const getMyFriends = async (req, res) => {
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
    // console.log(req.query);
    // const { id } = req.query;

    try {
        const { id } = req.query;
        // console.log(id);
        // 使用关联查询获取用户的好友列表
        const userM = await Friendly.findFriendByUserM(id);
        const userY = await Friendly.findFriendByUserY(id);

        // console.log('userM', userM);
        // console.log('userY', userY);

        // 处理查询结果并返回
        let data = [];
        userM.forEach((item) => {
            // console.log('item', item.userYId);
            data.push({
                createDate: item.createDate,
                name: item.userYId.name,
                nickname: item.userYId.nickname,
                photo: item.userYId.photo,
                signature: item.userYId.signature,
                id: item.userYId.id,
                // level: computedLevel(item.userYId.onlineTime),
                roomid: item.id + '-' + item.userYId.id
            });
        });
        // console.log('data',data);
        userY.forEach((item) => {
            // console.log('item', item.userMId);
            data.push({
                createDate: item.createDate,
                name: item.userMId.name,
                nickname: item.userMId.nickname,
                photo: item.userMId.photo,
                signature: item.userMId.signature,
                id: item.userMId.id,
                // level: computedLevel(item.userYId.onlineTime),
                roomid: item.id + '-' + item.userMId.id
            });
        });
        // console.log('data', data);

        return res.json({
            status: 200,
            data: data,
            msg: '获取好友列表成功'
        });
    } catch (error) {
        console.error('Error occurred during the query:', error);
        return res.status(1006).json({
            status: 1006,
            msg: 'Internal server error'
        });
    }
};

const deleteFriend = async (req, res) => {
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
    const { userY, userM } = req.body;
    const token = req.headers.authorization;
    const userId = parseToken(token);
    // console.log('userId', userId);
    if (userId !== userM) {
        return res.json({
            status: 4001,
            data: '',
            msg: '删除失败！'
        });
    }

    const dataA = await Friendly.destroy({ where: { userY: [userY], userM: [userM] } });
    const dataB = await Friendly.destroy({ where: { userY: [userM], userM: [userY] } });
    // console.log(dataA);
    // console.log(dataB);

    const data = await Friendly.findAll({ where: { userM: [userM] } });
    res.json({
        status: 200,
        data: data,
        msg: 'delete success'
    });
};

module.exports = {
    addFriend,
    getMyFriends,
    deleteFriend
};
