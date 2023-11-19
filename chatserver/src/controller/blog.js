const db = require('../utils/connectDB');
const { blog } = require('../models/blog');
const { createToken, parseToken } = require('../utils/authorization');
const { Users } = require('../models/users');

const addBlog = async (req, res) => {
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
    // console.log(req.body);
    try {
        const { authorId, content, title } = req.body;
        const existingBlog = await blog.findOne({ where: { title: title } });
        console.log('existingBlog', existingBlog);
        if (existingBlog) {
            res.json({
                status: 1003,
                msg: '该博客名已存在'
            });
        } else {
            const newBlog = await blog.create({
                content: content,
                authorId: authorId,
                title: title,
                createDate: Date.now() + 8 * 3600000,
                updateDate: Date.now() + 8 * 3600000
            });
            // console.log(newBlog);
            res.json({
                status: 200,
                msg: 'addBlog success'
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const getBlog = async (req, res) => {
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
    const { userId } = req.query;
    const allBlog = await blog.findAll({
        where: { authorId: userId }
    });

    if (allBlog) {
        for (const item of allBlog) {
            console.log('item', item);
            const author = await Users.findOne({ where: { id: item.authorId } });
            item.dataValues.authorName = author.name;
        }
    }
    console.log(allBlog);
    res.json({
        status: 200,
        data: allBlog,
        msg: 'getBlog success'
    });
};

const getBlogDetailById = async (req, res) => {
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
    const { blogId } = req.query;
    const blogDetail = await blog.findOne({
        where: { id: blogId }
    });
    if (blogDetail) {
        const author = await Users.findOne({ where: { id: blogDetail.authorId } });
        blogDetail.dataValues.authorName = author.name;
    }
    console.log(blogDetail);
    res.json({
        status: 200,
        data: blogDetail,
        msg: 'getBlogDetail success'
    });
};

const updateBlog = async (req, res) => {
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
    // console.log(req.body);
    const { content, title } = req.body;
    const existingBlog = await blog.findOne({ where: { title: title } });
    if (existingBlog) {
        await blog.update({ content: content }, { where: { title: title } });
        res.json({
            status: 200,
            msg: 'updateBlog success'
        });
    } else {
        res.json({
            status: 1007,
            msg: '该条博客已被删除,无法修改,是否需要重新发送'
        });
    }
};

module.exports = {
    addBlog,
    getBlog,
    getBlogDetailById,
    updateBlog
};
