const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const blogController = require('../controller/blog');

router.post('/addBlog', blogController.addBlog); // 添加博客
router.get('/getBlog', blogController.getBlog); // 获取博客列表
router.get('/getBlogDetailById', blogController.getBlogDetailById); // 根据博客Id获取博客详情
router.post('/updateBlog', blogController.updateBlog); // 修改博客
module.exports = router;
