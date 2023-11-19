const db = require('../utils/connectDB');
const { validateNews } = require('../models/validateNews');
const { Group } = require('../models/Group');
const { createToken, parseToken } = require('../utils/authorization');

// 添加验证信息
const insertValidateNews = async (val) => {
    // console.log('insertValidateNews', val);
    try {
        // user
        if (val.validateType === 0) {
            console.log(111);
            const {
                additionMessage,
                reveiverId,
                senderAvatar,
                senderId,
                senderNickname,
                senderName,
                validateType
            } = val;
            // console.log('val', val);
            await validateNews.create({
                additionMessage: additionMessage,
                reveiverId: reveiverId,
                senderId: senderId,
                senderName: senderName,
                senderNickname: senderNickname,
                senderAvatar: senderAvatar,
                timer: Date.now() + 8 * 3600000,
                validateType: validateType
            });
        } else {
            // group
            const {
                additionMessage,
                groupId,
                senderAvatar,
                senderId,
                senderNickname,
                senderName,
                validateType
            } = val;
            // console.log('group');
            await validateNews.create({
                additionMessage: additionMessage,
                groupId: groupId,
                senderId: senderId,
                senderName: senderName,
                senderNickname: senderNickname,
                senderAvatar: senderAvatar,
                timer: Date.now() + 8 * 3600000,
                validateType: validateType
            });
        }
        // console.log(news);
    } catch (err) {
        console.log('数据库错误', err);
    }
};

// 获取好友申请列表
const getMyValidateNews = async (req, res) => {
    const { reveiverId } = req.query;
    // console.log(req.query);

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
    // const id = md5(reveiverId);
    // console.log(reveiverId);
    const validateNewsUserList = await validateNews.findAll({
        where: { reveiverId: [reveiverId] }
    });
    let validateNewsGroup = await Group.findAll({
        where: { holderUserId: reveiverId }
    });

    if (validateNewsGroup) {
        let resultArray = [];
        for (let i = 0; i < validateNewsGroup.length; i++) {
            const groupId = validateNewsGroup[i].id;
            const groupName = validateNewsGroup[i].title;
            // console.log('groupId', validateNewsGroup.groups);
            var validateNewsGroupList = await validateNews.findAll({
                where: { groupId: [groupId] }
            });
            const modifiedGroupList = validateNewsGroupList.map((item) => {
                return {
                    ...item.get(), // Assuming validateNewsGroupList is a Sequelize Model instance
                    groupName: groupName
                };
            });

            resultArray.push(...modifiedGroupList);
        }
        // console.log(resultArray);

        // console.log();
        const validateNewsList = { validateNewsUserList, resultArray };
        // console.log('validateNewsGroupList', validateNewsGroupList);
        res.json({
            status: 200,
            data: validateNewsList,
            msg: 'validateNews 获取成功'
        });
    } else {
        res.json({
            status: 200,
            data: validateNewsUserList,
            msg: 'validateNewsUserList 获取成功'
        });
    }
};

// 改变添加好友申请状态 1 同意 2 拒绝
const changeValidateNewsStatus = async (data, status) => {
    if (data.validateType == '0') {
        const { senderId, reveiverId } = data;
        await validateNews.update(
            {
                status: Number(status)
            },
            { where: { senderId: [senderId], reveiverId: [reveiverId] } }
        );
    } else if (data.validateType == '1') {
        const { senderId, groupId } = data;
        await validateNews.update(
            {
                status: Number(status)
            },
            { where: { senderId: [senderId], groupId: [groupId] } }
        );
    }
};

module.exports = {
    insertValidateNews,
    getMyValidateNews,
    changeValidateNewsStatus
};
