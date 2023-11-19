// 用户朋友圈的数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});
const { Users } = require('./users');

const pyqNews = sequelize.define('pyqnews', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    createDate: { type: DataTypes.DATE, defaultValue: Date.now() },
    content: {
        type: DataTypes.STRING,
        required: true
    },
    pictures: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    // 阅读量
    readCount: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
    // 点赞
    likes: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    }
});

// pyqNews.belongsTo(Users, { as: 'userId', foreignKey: 'userId', targetKey: 'id' });

// pyqNews.findUserById = function (userId) {
//     console.log('userId', userId);
//     return pyqNews.findAll({
//         where: {
//             userId: userId
//         },
//         include: [
//             {
//                 model: Users,
//                 as: 'userId',
//                 attributes: ['id', 'name', 'signature', 'photo', 'nickname', 'onlineTime']
//             }
//         ]
//     });
// };

module.exports = {
    pyqNews
};
