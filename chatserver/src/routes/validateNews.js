const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const validateNewsController = require('../controller/validateNews');

router.get('/sendValidateMessage', validateNewsController.sendValidateMessage); // 发送好友验证

module.exports = router;
