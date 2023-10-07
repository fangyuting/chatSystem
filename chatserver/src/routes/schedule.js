const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const scheduleController = require('../controller/schedule');

router.post('/addEvent', scheduleController.addEvent); // 添加日程
router.get('/getEvent', scheduleController.getEvent); // 获取日程
module.exports = router;
