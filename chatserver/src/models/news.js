// 消息数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const News = sequelize.define('news', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },

    isReaderUser: { type: DataTypes.ARRAY(Sequelize.STRING), required: true }, // 值为用户的ID，判断已经读取的用户，在发送消息的时候默认发送发已经读取，在单独会话中Array值只有两个
    message: { type: DataTypes.STRING, required: true }, // 消息内容
    messageType: { type: DataTypes.STRING, required: true }, // 消息的类型：emoji/text/img/file/sys/whiteboard/video/audio
    roomid: { type: DataTypes.STRING }, // 群聊id
    senderAvatar: { type: DataTypes.STRING, defaultValue: '' }, // 发送者头像
    senderId: {
        type: DataTypes.STRING,
        required: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }, // 发送者id
    senderNickname: { type: DataTypes.STRING, defaultValue: '' }, // 发送者昵称
    senderName: { type: DataTypes.STRING, required: true }, // 发送者登录名
    time: { type: DataTypes.DATE, defaultValue: Date.now() }
});

module.exports = {
    News
};
