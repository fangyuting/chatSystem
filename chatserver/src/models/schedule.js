// 日程计划数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const Schedule = sequelize.define('schedules', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    name: { type: Sequelize.STRING, unique: true },
    title: { type: Sequelize.STRING, unique: true },
    start: { type: Sequelize.DATE, unique: true },
    end: { type: Sequelize.DATE, unique: true },
    cssClass: { type: Sequelize.STRING, unique: true }
});

sequelize.sync();

module.exports = { Schedule };
