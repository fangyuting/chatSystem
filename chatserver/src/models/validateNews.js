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
    additionMessage: { type: DataTypes.STRING, defaultValue: '0' }, // 附加信息
    reveiverId: {
        type: DataTypes.STRING,
        defaultValue: '0',
        references: {
            model: 'user', // 假设你的用户模型被命名为 'users'
            key: 'id'
        }
    }, // 接收者ID
    groupId: {
        type: DataTypes.STRING,
        defaultValue: '0',
        references: {
            model: 'Group', // 假设你的用户模型被命名为 'users'
            key: 'id'
        }
    }, // 群聊ID
    roomid: { type: DataTypes.STRING, defaultValue: '' }, // 群聊ID
    senderAvatar: { type: DataTypes.STRING, defaultValue: '0' }, // 发送者头像
    senderId: {
        type: DataTypes.STRING,
        defaultValue: '0',
        references: {
            model: 'user', // 假设你的用户模型被命名为 'users'
            key: 'id'
        }
    }, // 发送者ID
    senderNickname: { type: DataTypes.STRING, defaultValue: '0' }, // 发送者昵称
    senderName: { type: DataTypes.STRING, defaultValue: '0' }, // 发送者账号
    status: { type: DataTypes.STRING, defaultValue: '0' }, // 0/1/2 未处理/同意/不同意
    timer: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    }, // 消息发送时间
    validateType: { type: DataTypes.STRING, defaultValue: '0' } // 0/1 好友/群聊
});

sequelize.sync();

module.exports = { validateNews };
