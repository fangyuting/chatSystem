// 群组数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

// 群组用户表
const GroupUser = sequelize.define('groupusers', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    card: { type: DataTypes.STRING, defaultValue: '' }, // 群名片
    groupId: { type: DataTypes.STRING }, // 群ID
    holder: { type: DataTypes.STRING, defaultValue: 0 }, // 是否是群主 默认0 不是 1 是
    manager: { type: DataTypes.STRING, defaultValue: 0 }, // 是否是管理员 默认0 不是 1 是
    time: { type: DataTypes.DATE, defaultValue: Date.now() },
    userId: { type: DataTypes.STRING }, // 用户ID
    userName: { type: DataTypes.STRING } // 用户姓名
});

// 群组表
const Group = sequelize.define('groups', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    code: { type: DataTypes.STRING }, // 在系统中的唯一标识符
    createDate: { type: DataTypes.DATE, defaultValue: Date.now() }, // 建群时间
    desc: { type: DataTypes.STRING, defaultValue: '' }, // 群的描述
    grades: { type: DataTypes.STRING, defaultValue: '1' }, // 群等级 备用
    holderName: { type: DataTypes.STRING }, // 群主账号 在user实体中对应的name字段
    holderUserId: {
        type: DataTypes.STRING,
        references: {
            model: 'users', // 假设你的用户模型被命名为 'users'
            key: 'id'
        }
    },
    img: { type: DataTypes.STRING, defaultValue: '/img/picture.png' }, // 群图片
    title: { type: DataTypes.STRING, required: true }, // 群名称
    userNum: { type: DataTypes.STRING, defaultValue: '' } // 群成员数量，避免某些情况需要多次联表查找，如搜索；所以每次加入一人，数量加一
});
sequelize.sync();

module.exports = {
    GroupUser,
    Group
};
