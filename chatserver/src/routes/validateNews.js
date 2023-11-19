const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const validateNewsController = require('../controller/validateNews');

router.get('/insertValidateNews', validateNewsController.insertValidateNews); // 发送好友验证
router.get('/getMyValidateNews', validateNewsController.getMyValidateNews); // 获取好友申请列表

module.exports = router;
