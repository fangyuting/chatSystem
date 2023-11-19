const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const pyqLikeController = require('../controller/pyqLike');

router.post('/doLike', pyqLikeController.doLike); // 点赞
module.exports = router;
