// 朋友圈点赞数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const pyqLike = sequelize.define('pyqlikes', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    pyqId: {
        type: DataTypes.STRING,
        references: {
            model: 'pyqNews',
            key: 'id'
        }
    },
    createDate: { type: DataTypes.DATE, defaultValue: Date.now() },
    authorId: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'id'
        }
    }
});

module.exports = {
    pyqLike
};
