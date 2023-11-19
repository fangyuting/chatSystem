const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const userController = require('../controller/user');

router.post('/login', userController.login); // 登录
router.get('/getCVCode', userController.getCVCode); // 获取验证码
router.post('/register', userController.register); // 注册
router.get('/getUserInfo', userController.getUserInfo); // 获取用户信息
router.post('/updateUserInfo', userController.updateUserInfo); // 更新用户信息
router.post('/updateUserPwd', userController.updateUserPwd); // 更新用户密码
router.get('/preFetchUser', userController.preFetchUser); // 获取指定用户列表
router.post('/addNewFenzu', userController.addNewFenzu); // 添加新的分组
router.post('/modifyFriendFenzu', userController.modifyFriendFenzu); // 切换分组

module.exports = router;
