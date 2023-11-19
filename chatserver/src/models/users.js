// 用户数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const Users = sequelize.define(
    'users',
    {
        id: {
            // 使用时间戳生成 UUID
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
            // type: Sequelize.INTEGER(10),
            // autoIncrement: true, // 自增长
            // primaryKey: true,
            // unique: true,
            // allowNull: false // 不允许为空
            // defaultValue: 0 // 设置默认值，你可以设置为你需要的默认值
        },
        name: { type: Sequelize.STRING, unique: true },
        pass: Sequelize.STRING,
        code: { type: Sequelize.STRING, unique: true },
        photo: { type: Sequelize.STRING, defaultValue: '/img/picture.png' }, // 默认头像
        signature: { type: Sequelize.STRING, defaultValue: '' },
        nickname: { type: Sequelize.STRING, defaultValue: '' },
        email: { type: Sequelize.STRING, defaultValue: '' },
        province: { type: Sequelize.JSON, defaultValue: { name: '四川省', value: '510000' } }, // 省
        city: { type: Sequelize.JSON, defaultValue: { name: '成都市', value: '510100' } }, // 市
        town: { type: Sequelize.JSON, defaultValue: { name: '龙泉驿区', value: '510112' } }, // 县
        sex: { type: Sequelize.STRING, defaultValue: '3' }, // 0 男 1 女 3 保密
        bubble: { type: Sequelize.STRING, defaultValue: 'vchat' }, // 气泡
        chatColor: { type: Sequelize.STRING, defaultValue: '#ffffff' }, // 聊天文字颜色
        bgOpa: { type: Sequelize.FLOAT, defaultValue: 0.2 }, // 聊天框透明度
        projectTheme: { type: Sequelize.STRING, defaultValue: 'vchat' }, // 项目主题
        wallpaper: { type: Sequelize.STRING, defaultValue: '/img/wallpaper.jpg' }, // 聊天壁纸
        signUpTime: { type: Sequelize.DATE, defaultValue: Date.now() }, // 注册时间
        lastLoginTime: { type: Sequelize.DATE, defaultValue: Date.now() }, // 最后一次登录
        conversationsList: { type: DataTypes.ARRAY(Sequelize.JSON), defaultValue: [] }, // 会话列表 * name 会话名称 * photo 会话头像 * id 会话id * type 会话类型 group/ friend
        cover: {
            type: DataTypes.ARRAY(Sequelize.STRING),
            defaultValue: ['/img/cover.jpg', '/img/cover1.jpg']
        }, // 封面展示
        emoji: { type: DataTypes.ARRAY(Sequelize.JSON), defaultValue: [] }, // 表情包
        status: { type: Sequelize.INTEGER, defaultValue: 0 }, // 0：正常可用，1：冻结不可用，2：注销不可用
        age: { type: Sequelize.STRING, defaultValue: '18' },
        loginSetting: {
            // 存储用户登录的IP、浏览器、OS等信息
            type: Sequelize.JSON,
            defaultValue: {}
        },
        friendFenzu: {
            type: Sequelize.JSON,
            defaultValue: { 我的好友: [] }
        },

        /**
         * {
         *    id: 'C罗',
         *    id: '梅西'
         * }
         */
        onlineTime: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    },
    {
        tableName: 'users',
        primaryKey: 'id'
        // timestamps: false // 禁用默认的时间戳字段
    }
);

sequelize.sync();

module.exports = { Users };
