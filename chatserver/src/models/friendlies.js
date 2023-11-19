// 好友数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const { Users } = require('./users');

const Friendly = sequelize.define('friendlies', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    createDate: { type: DataTypes.DATE, defaultValue: Date.now() },
    userM: {
        type: DataTypes.STRING,
        defaultValue: '0',
        references: {
            model: 'users', // 假设你的用户模型被命名为 'users'
            key: 'id'
        }
    },
    userY: {
        type: DataTypes.STRING,
        defaultValue: '0',
        references: {
            model: 'users', // 假设你的用户模型被命名为 'users'
            key: 'id'
        }
    }
});

// 定义查询方法
Friendly.belongsTo(Users, { as: 'userYId', foreignKey: 'userY', targetKey: 'id' });
Friendly.belongsTo(Users, { as: 'userMId', foreignKey: 'userM', targetKey: 'id' });

Friendly.findFriendByUserM = function (userId) {
    console.log('userId', userId);
    return Friendly.findAll({
        where: {
            userM: userId
        },
        // include关键字表示关联查询
        include: [
            {
                model: Users, // 假设你的用户模型被命名为 'users'
                as: 'userYId',
                attributes: ['id', 'name', 'signature', 'photo', 'nickname', 'onlineTime']
            }
        ]
    });
    // .then((result) => {
    //     console.log('UserM查询成功', result);
    //     console.log('UserM查询成功', result[0].dataValues);
    //     console.log('UserM查询成功', result.id);
    // })
    // .catch((err) => {
    //     console.log('UserM查询失败', err);
    // });
};

Friendly.findFriendByUserY = function (userId) {
    console.log('userId', userId);
    return Friendly.findAll({
        where: {
            userY: userId
        },
        // include关键字表示关联查询
        include: [
            {
                model: Users, // 假设你的用户模型被命名为 'users'
                as: 'userMId',
                attributes: ['id', 'name', 'signature', 'photo', 'nickname', 'onlineTime']
            }
        ]
    });
    // .then((result) => {
    //     console.log('UserY查询成功', result);
    // })
    // .catch((err) => {
    //     console.log('UserY查询失败', err);
    // });
};

module.exports = {
    Friendly
};
