const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const friendliesController = require('../controller/friendlies');

router.get('/getMyFriends', friendliesController.getMyFriends); // 获取好友列表
router.post('/deleteFriend', friendliesController.deleteFriend); // 删除好友
module.exports = router;
