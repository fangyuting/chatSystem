const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const pyqNewsController = require('../controller/pyqNews');

router.get('/getMyNews', pyqNewsController.getMyFriendPyqNews); // 获取我的朋友圈好友动态
router.post('/addNewStory', pyqNewsController.addNewStory); // 添加新的动态
router.get('/getMyMzone', pyqNewsController.getMyMzone); // 获取我的动态
router.post('/deleteMyMzone', pyqNewsController.deleteMyMzone); // 删除我的动态
module.exports = router;
