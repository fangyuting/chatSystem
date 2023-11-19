// 朋友圈评论数据模型
const { Sequelize, DataTypes } = require('sequelize');
//                              数据库名   账号     密码
const sequelize = new Sequelize('chat', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const pyqComments = sequelize.define('pyqcomments', {
    id: {
        // 使用时间戳生成 UUID
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    authorId: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    content: {
        type: DataTypes.STRING,
        required: true
    },
    createDate: { type: DataTypes.DATE, defaultValue: Date.now() },
    level: { type: DataTypes.NUMBER, defaultValue: 0 },
    parentId: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    pyqId: {
        type: DataTypes.STRING,
        references: {
            model: 'pyqNews',
            key: 'id'
        }
    },
    replyToAuthorInfo: {
        type: Sequelize.JSON,
        defaultValue: {}
    }
});

module.exports = {
    pyqComments
};
