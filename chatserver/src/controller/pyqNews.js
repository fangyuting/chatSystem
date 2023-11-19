const db = require('../utils/connectDB');
const { pyqNews } = require('../models/pyqNews');
const { Friendly } = require('../models/friendlies');
const { pyqLike } = require('../models/pyqLike');
const { Users } = require('../models/users');
const { pyqComments } = require('../models/pyqComments');
const { createToken, parseToken } = require('../utils/authorization');

const getMyFriendPyqNews = async (req, res) => {
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
    const { id } = req.query;

    /************************************ 获取好友信息 ************************************/
    const userM = await Friendly.findFriendByUserM(id);
    const userY = await Friendly.findFriendByUserY(id);
    // 处理查询结果并返回
    let data = [];
    userM.forEach((item) => {
        data.push({
            createDate: item.createDate,
            name: item.userYId.name,
            nickname: item.userYId.nickname,
            photo: item.userYId.photo,
            signature: item.userYId.signature,
            id: item.userYId.id,
            roomid: item.id + '-' + item.userYId.id
        });
    });
    userY.forEach((item) => {
        data.push({
            createDate: item.createDate,
            name: item.userMId.name,
            nickname: item.userMId.nickname,
            photo: item.userMId.photo,
            signature: item.userMId.signature,
            id: item.userMId.id,
            roomid: item.id + '-' + item.userMId.id
        });
    });
    // console.log('pyqFriendsData', data);

    /************************************ 通过 好友id & 自己的id 获取朋友圈信息 ************************************/
    let pyqList = [];
    const myPyq = await pyqNews.findAll({ where: { userId: [id] } });
    // 获取自己的朋友圈信息
    for (const value of myPyq) {
        const myName = await Users.findOne({ where: { id: [id] } });
        // console.log('myName', myName.name);
        value.dataValues.userName = myName.name;
        value.dataValues.avatar = myName.photo;
        pyqList.push(value);
    }
    // 获取好友的朋友圈信息
    for (const item of data) {
        const pyq = await pyqNews.findAll({ where: { userId: [item.id] } });

        // console.log(myPyq);
        for (const value of pyq) {
            // console.log('value', value);
            // 把好友的名字也加进去
            value.dataValues.userName = item.name;
            value.dataValues.avatar = item.photo;
            // console.log(value);
            pyqList.push(value);
        }
    }
    // console.log('pyqList', pyqList);

    /************************************ 根据好友朋友圈id查找点赞信息 ************************************/

    let pyqLikeList = [];
    for (const item of pyqList) {
        // console.log('item', item);
        const pyqLikes = await pyqLike.findAll({ where: { pyqId: [item.id] } });
        for (const value of pyqLikes) {
            const author = await Users.findOne({ where: { id: [value.authorId] } });
            value.dataValues.authorName = author.name;
            value.dataValues.avatar = author.photo;
            pyqLikeList.push(value);
        }
    }
    /************************************ 根据好友朋友圈id查找评论信息 ************************************/

    let pyqCommentList = [];
    for (const item of pyqList) {
        const pyqComment = await pyqComments.findAll({ where: { pyqId: [item.id] } });
        // console.log('pyqComment', pyqComment);
        for (const value of pyqComment) {
            const author = await Users.findOne({ where: { id: [value.authorId] } });
            value.dataValues.authorName = author.name;
            value.dataValues.avatar = author.photo;
            pyqCommentList.push(value);
        }
    }

    const pyq = { pyqList, pyqLikeList, pyqCommentList };
    res.json({
        status: 200,
        data: pyq,
        msg: 'getNews success'
    });
};

const addNewStory = async (req, res) => {
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
    const { content, pictures = [], userId } = req.body;
    // console.log(req.body);
    const newStory = await pyqNews.create({
        content: content,
        pictures: pictures,
        userId: userId,
        createDate: Date.now() + 8 * 3600000
    });
    // console.log(newStory);
    if (newStory) {
        res.json({
            status: 200,
            msg: 'add story success'
        });
    }
};

const getMyMzone = async (req, res) => {
    const { id } = req.query;
    // let pyqList =[]
    const myMzone = await pyqNews.findAll({ where: { userId: id } });
    // 获取自己的朋友圈信息
    for (const value of myMzone) {
        const myName = await Users.findOne({ where: { id: [id] } });
        // console.log('myName', myName.name);
        value.dataValues.userName = myName.name;
        value.dataValues.avatar = myName.photo;
        // pyqList.push(value);
    }
    // console.log('myMzone', myMzone);
    let myMzoneLikeList = [];
    for (const item of myMzone) {
        // console.log('item', item);
        const myMzoneLikes = await pyqLike.findAll({ where: { pyqId: [item.id] } });
        for (const value of myMzoneLikes) {
            const author = await Users.findOne({ where: { id: [value.authorId] } });
            value.dataValues.authorName = author.name;
            value.dataValues.avatar = author.photo;
            myMzoneLikeList.push(value);
        }
    }
    // console.log('myMzoneLikeList', myMzoneLikeList);

    let myMzoneCommentList = [];
    for (const item of myMzone) {
        const myMzoneComment = await pyqComments.findAll({ where: { pyqId: [item.id] } });
        // console.log('pyqComment', pyqComment);
        for (const value of myMzoneComment) {
            const author = await Users.findOne({ where: { id: [value.authorId] } });
            value.dataValues.authorName = author.name;
            value.dataValues.avatar = author.photo;
            myMzoneCommentList.push(value);
        }
    }
    // console.log('myMzoneCommentList', myMzoneCommentList);

    const myMzoneList = { myMzone, myMzoneLikeList, myMzoneCommentList };
    res.json({
        status: 200,
        data: myMzoneList,
        msg: 'get my mzone success'
    });
};

const deleteMyMzone = async (req, res) => {
    const { pyqId } = req.body;
    // console.log(pyqId);
    const pyq = await pyqNews.destroy({ where: { id: pyqId } });
    // console.log('pyq', pyq);
    await pyqLike.destroy({ where: { pyqId: pyqId } });
    await pyqComments.destroy({ where: { pyqId: pyqId } });
    res.json({
        status: 200,
        msg: 'delete mzone success'
    });
};

module.exports = {
    getMyFriendPyqNews,
    addNewStory,
    getMyMzone,
    deleteMyMzone
};
