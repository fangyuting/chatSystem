const db = require('../utils/connectDB');
const { pyqComments } = require('../models/pyqComments');
const { createToken, parseToken } = require('../utils/authorization');

const getMyPyqComments = async (req, res) => {
    res.json({
        status: 200,
        msg: 'get comments success'
    });
};

const addComment = async (req, res) => {
    
    if (parseToken(req.headers.authorization) == null) {
        return res.json({
            status: 1006,
            data: [],
            msg: 'Token 已过期'
        });
    } else if (parseToken(req.headers.authorization) == 'errToken') {
        return res.json({
            status: 1006,
            data: [],
            msg: 'Token 无效'
        });
    }
    const { pyqId, content, authorId, parentId = '', level = 0, replyToAuthorInfo = {} } = req.body;
    // console.log(req.body);
    // console.log(replyToAuthorInfo);
    const comment = await pyqComments.create({
        authorId: authorId,
        content: content,
        createDate: Date.now() + 8 * 3600000,
        level: level,
        parentId: parentId,
        pyqId: pyqId,
        replyToAuthorInfo: replyToAuthorInfo
    });
    // console.log(comment);
    if (comment) {
        res.json({
            status: 200,
            msg: 'add comments success'
        });
    }
};

module.exports = {
    getMyPyqComments,
    addComment
};
