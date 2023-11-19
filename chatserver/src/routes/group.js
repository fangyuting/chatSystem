const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const groupController = require('../controller/group');

router.get('/preFetchGroup', groupController.preFetchGroup); // 获取指定群组列表
router.get('/getMyGroup', groupController.getMyGroup); // 获取我的群组
router.post('/addNewGroup', groupController.addNewGroup); // 创建新群组
module.exports = router;
