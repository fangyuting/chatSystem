const db = require('../utils/connectDB');
const { validateNews } = require('../models/validateNews');

// 发送验证消息
const sendValidateMessage = (req, res) => {
    const { senderId, senderNickname, senderName, senderAvatar, receiverId } = req.query;
    // console.log(req.query);
    // console.log('test');

    // const revivedUser =
    res.json({
        status: 200,
        msg: 'send success'
    });
};

module.exports = {
    sendValidateMessage
};
