const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const pyqCommentsController = require('../controller/pyqComments');

router.get('/getMyPyqComments', pyqCommentsController.getMyPyqComments); // 获取评论
router.post('/addComment',pyqCommentsController.addComment); // 添加评论
module.exports = router;
