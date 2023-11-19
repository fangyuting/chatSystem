const db = require('../utils/connectDB');
const { GroupUser, Group } = require('../models/Group');
const { createToken, parseToken } = require('../utils/authorization');

// 获取指定群组信息
const preFetchGroup = async (req, res) => {
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
    try {
        const { optionType, value, pageSize = 6, pagenum = 1 } = req.query;
        const limitValue = parseInt(pageSize, 10);

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
        const existingGroup = await Group.findAndCountAll({
            where: {
                [optionType]: value
            },
            offset: (pagenum - 1) * limitValue,
            limit: limitValue
        });
        // console.log(existingGroup);

        res.json({
            status: 200,
            data: existingGroup,
            pagination: {
                currentPage: pagenum,
                pageSize: pageSize,

                // 一共有多少条记录
                total: existingGroup.count
            },
            msg: 'fetch group success'
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: 1006,
            data: [],
            msg: 'Internal Server Error'
        });
    }
};

// 添加新的群成员
const addNewGroupUser = async (data) => {
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
    const { groupId, senderId, senderName } = data;
    // console.log(data);
    try {
        const existingUser = await GroupUser.findOne({
            where: {
                groupId: groupId,
                userId: senderId
            }
        });
        if (!existingUser) {
            // console.log('existingUser', existingUser);
            const newGroupUser = await GroupUser.create({
                groupId: groupId,
                userId: senderId,
                userName: senderName,
                createDate: Date.now() + 8 * 3600000
            });
            console.log(newGroupUser);
        } else {
            console.log('用户已在群组中');
        }
    } catch (error) {}
};

// 获取我的群组
const getMyGroup = async (req, res) => {
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
    const { userId } = req.query;
    console.log(userId);
    const existingGroup = await GroupUser.findAll({ where: { userId: userId } });
    console.log('existingGroup', existingGroup);
    let groupList = [];
    if (existingGroup) {
        for (let i = 0; i < existingGroup.length; i++) {
            let obj = {};
            console.log(existingGroup[i].groupId);
            let group = await Group.findOne({ where: { id: existingGroup[i].groupId } });
            console.log('group', group);
            console.log('group.title', group.title);
            obj.title = group.title;
            obj.groupId = group.id;
            obj.holderName = group.holderName;
            obj.img = group.img;
            obj.desc = group.desc;
            groupList.push(obj);
        }
        console.log('groupList', groupList);
        console.log('existingGroup', existingGroup);
    }
    const groupInfo = { existingGroup, groupList };
    console.log('groupInfo', groupInfo);
    res.json({
        status: 200,
        data: groupInfo,
        msg: 'getGroup success'
    });
};

const addNewGroup = async (req, res) => {
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
    const { groupName, groupDesc, avatar, userId, userName } = req.body;
    console.log(req.body);

    const existingGroup = await Group.findOne({ where: { title: groupName } });
    console.log(existingGroup);
    if (existingGroup) {
        res.json({
            status: 1003,
            msg: '该群已被注册'
        });
    } else {
        await Group.create({
            title: groupName,
            desc: groupDesc,
            holderName: userName,
            holderUserId: userId,
            img: avatar,
            createDate: Date.now() + 8 * 3600000
        });
        const group = await Group.findOne({ where: { title: groupName } });

        await GroupUser.create({
            groupId: group.id,
            holder: userId,
            holder: 1,
            manager: 1,
            userId: userId,
            userName: userName,
            time: Date.now() + 8 * 3600000
        });

        res.json({
            status: 200,
            msg: 'addGroup success'
        });
    }
};

module.exports = {
    preFetchGroup,
    addNewGroupUser,
    getMyGroup,
    addNewGroup
};
