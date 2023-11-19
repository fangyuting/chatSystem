// 博客数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const blog = sequelize.define('blogs', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    createDate: { type: DataTypes.DATE, defaultValue: Date.now() },
    authorId: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING(5000), defaultValue: '' },
    cover: { type: DataTypes.STRING, defaultValue: '' },
    desc: { type: DataTypes.STRING, defaultValue: '' },
    likeNum: { type: DataTypes.NUMBER, defaultValue: 0 },
    tags: { type: DataTypes.JSON, defaultValue: {} },
    title: { type: DataTypes.STRING },
    updateDate: { type: DataTypes.DATE, defaultValue: Date.now() }
});

module.exports = { blog };
