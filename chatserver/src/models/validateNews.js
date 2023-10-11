// 验证消息数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const validateNews = sequelize.define('validatenews', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    reveiverId: { type: Sequelize.STRING, unique: true }, // 接收者ID
    roomid: { type: Sequelize.STRING, unique: true }, // 群聊ID
    senderAvatar: { type: Sequelize.STRING, unique: true }, // 发送者头像
    senderId: { type: Sequelize.STRING, unique: true }, // 发送者ID
    senderNickname: { type: Sequelize.STRING, unique: true }, // 发送者昵称
    senderName: { type: Sequelize.STRING, unique: true }, // 发送者账号
    status: { type: Sequelize.STRING, unique: true }, // 0/1/2 未处理/同意/不同意
    timer: { type: Sequelize.STRING, unique: true }, // 消息发送时间
    validateType: { type: Sequelize.STRING, unique: true } // 0/1 好友/群聊
});

sequelize.sync();

module.exports = { validateNews };
