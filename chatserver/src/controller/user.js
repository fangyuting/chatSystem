const db = require('../utils/connectDB');
const cvCode = require('../utils/cvCode').cvCode;
const md5 = require('./../utils').md5;
let verificationCode = ''; // 验证码
const nowTimeStamp = Date.now();
const { User } = require('../models/user');
const { createToken, parseToken } = require('../utils/authorization');

// 获取验证码
const getCVCode = (req, res) => {
    const { code, timestamp } = cvCode();
    verificationCode = code;
    return res.json({
        status: 200,
        data: verificationCode,
        timestamp,
        msg: 'code success'
    });
};

// 登录
const login = async (req, res) => {
    // 请求数据
    // console.log(req.body);
    let { account, password, cvCode, cvCodeTimestamp } = req.body;
    /* 登陆失败的几种情况:
                        1. 验证码错误 1002
                        2. 验证码过期 1002
                        3. 账户错误   1001
                        4. 密码错误   1001
                        5. 账户被冻结 1006
                        6. 账户被注销 1007
    
    */

    try {
        const existingUser = await User.findOne({
            where: {
                name: account
            }
        });
        // console.log('existingUser');
        // console.log(existingUser);
        // const userAccount = result.filter((user) => user.name === account);
        let pass = md5(password); // 加密密码

        // 账号正确 密码错误     账号错误 密码正确       账号为空
        if (!existingUser || existingUser.dataValues.pass !== pass) {
            // console.log(userAccount);
            console.log('账号/密码错误');
            return res.json({
                status: 1001,
                data: null,
                msg: '登录失败：账号或密码错误'
            });
        } else if (existingUser && existingUser.dataValues.status == 1) {
            // 账户存在 但被冻结
            console.log('账户已被冻结');
            return res.json({
                status: 1008,
                data: null,
                msg: '用户账号被冻结'
            });
        } else if (existingUser && existingUser.dataValues.status == 2) {
            console.log('账户已被注销');
            return res.json({
                status: 1007,
                data: null,
                msg: '用户账户已被注销'
            });
        }
        // console.log(nowTimeStamp);
        // console.log(cvCodeTimestamp);
        // console.log(nowTimeStamp - cvCodeTimestamp);
        if (nowTimeStamp - cvCodeTimestamp > 60000) {
            console.log('验证码过期');
            return res.json({
                status: 1002,
                data: null,
                msg: '验证码已过期'
            });
        } else {
            if (cvCode.toLocaleUpperCase() !== verificationCode) {
                console.log('验证码错误');
                return res.json({
                    status: 1002,
                    data: null,
                    msg: '验证码错误'
                });
            }
        }
        const token = createToken(existingUser.id);
        // 更新上次登录时间
        await User.update(
            { lastLoginTime: Date.now() + 8 * 3600000 },
            { where: { name: account } }
        ).then((up) => {
            console.log('upSuccess', up);
        });
        // console.log('最新生成的token', token);
        return res.json({
            status: 1000,
            data: existingUser,
            token: token,
            msg: 'login success'
        });
    } catch (error) {
        console.error(error.message);
    }
};

// 注册
const register = async (req, res) => {
    // console.log(req.body);
    // 请求数据
    const { account, password, repassword, cvCodeTimestamp, cvCode } = req.body;

    /* 注册失败的几种情况:
                        1. 验证码错误 1002
                        2. 验证码过期 1002
                        3. 账户已存在 1003
                        4. bug 1004
    */
    try {
        const existingUser = await User.findOne({
            where: {
                name: account
            }
        });
        if (existingUser) {
            console.log('账户已被注册!');
            return res.json({
                status: 1003,
                data: null,
                msg: '账户已被注册'
            });
        }

        if (nowTimeStamp - cvCodeTimestamp > 60000) {
            console.log('验证码过期');
            return res.json({
                status: 1002,
                data: null,
                msg: '验证码已过期'
            });
        } else if (cvCode.toLocaleUpperCase() !== verificationCode) {
            console.log('验证码错误');
            return res.json({
                status: 1002,
                data: null,
                msg: '验证码错误'
            });
        } else {
            // 生成唯一的 code
            const uniqueCode = new Date().getTime().toString().substr(-6);

            // 使用 Sequelize 创建用户记录
            const newUser = await User.create({
                name: account, // 假设数据库中的字段名为 name
                pass: md5(password), // 假设数据库中的字段名为 pass
                code: uniqueCode
            });
            return res.json({
                status: 1005,
                data: newUser,
                msg: '注册成功'
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.json({
            status: 1004,
            data: '',
            msg: 'what ? ? ? ? 有bug ! ! ! !'
        });
    }
};

// 获取用户信息
const getUserInfo = async (req, res) => {
    // console.log(req.query);
    let { UserId } = req.query;
    try {
        const UserInfo = await User.findOne({
            where: {
                id: UserId
            }
        });
        // console.log(UserInfo);
        if (UserInfo) {
            return res.json({
                status: 200,
                data: UserInfo,
                msg: '获取用户信息成功'
            });
        } else {
            return res.json({
                status: 2001,
                msg: '没有获取到用户信息'
            });
        }
    } catch (err) {
        console.log(err.message);
        return res.json({
            status: 2003,
            msg: '服务器端错误'
        });
    }
};

// 更新用户信息
/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 *
 * 情况1: token 过期 2001
 * 情况2: token 无效 2006
 * 情况3: 修改的表单为name 不能重复 1003
 *
 */
const updateUserInfo = async (req, res) => {
    // console.log(req.body);
    /**
     * field：更新的项，比如昵称、性别等
     * [field] 变成键
     * value：更新的值
     * userId：用户的ID
     */

    const { field, value, userId } = req.body;
    // 解析token
    if (parseToken(req.headers.authorization) == null) {
        return res.json({
            status: 1006,
            data: [],
            msg: 'Token 已过期'
        });
    } else if (parseToken(req.headers.authorization) == 'errToken') {
        return res.json({
            status: 1006,
            data: [],
            msg: 'Token 无效'
        });
    }

    if (field == 'name') {
        const existing = await User.findOne({ where: { [field]: value } });
        if (existing) {
            return res.json({
                status: 1003,
                msg: '该昵称已被注册,换个昵称吧~'
            });
        }
    }

    await User.update(
        {
            [field]: value
        },
        { where: { id: userId } }
    ).then((up) => {
        console.log('updateSuccess', up);
    });
    const data = await User.findOne({ where: { id: userId } });
    // console.log(data);
    return res.json({
        status: 200,
        data: data,
        msg: 'success'
    });
};

const updateUserPwd = async (req, res) => {
    const { oldPwd, newPwd, userId } = req.body;
    // console.log(req.body);
    if (parseToken(req.headers.authorization) == null) {
        return res.json({
            status: 1006,
            data: [],
            msg: 'Token 已过期'
        });
    } else if (parseToken(req.headers.authorization) == 'errToken') {
        return res.json({
            status: 1006,
            data: [],
            msg: 'Token 无效'
        });
    }
    const existingUser = await User.findOne({ where: { id: userId } });
    // console.log(existingUser);

    if (existingUser) {
        if (md5(oldPwd) !== existingUser.dataValues.pass) {
            // console.log(md5(oldPwd));
            // console.log(existingUser.dataValues.pass);
            return res.json({
                status: 1001,
                data: null,
                msg: '原始密码错误'
            });
        } else {
            if (md5(newPwd) === existingUser.dataValues.pass) {
                return res.json({
                    status: 1009,
                    data: null,
                    msg: '新密码与旧密码相同'
                });
            }
            // console.log(md5(oldPwd));
            // console.log(existingUser.dataValues.pass);
            User.update(
                {
                    pass: md5(newPwd)
                },
                { where: { id: userId } }
            );
            // console.log(existingUser);
            return res.json({
                status: 200,
                data: null,
                msg: '修改密码成功'
            });
        }
    }
};

const preFetchUser = async (req, res) => {
    try {
        const { optionType, value, pageSize = 6, pagenum = 1 } = req.query;
        const limitValue = parseInt(pageSize, 10);
        // console.log(req.query);

        if (parseToken(req.headers.authorization) == null) {
            return res.json({
                status: 1006,
                data: [],
                msg: 'Token 已过期'
            });
        } else if (parseToken(req.headers.authorization) == 'errToken') {
            return res.json({
                status: 1006,
                data: [],
                msg: 'Token 无效'
            });
        }
        // offset 从哪里开始找 pagenum=1 第一页 从0开始找 (pagenum-1)*pageSize=0
        // limit 限制每页显示的数据
        const existingUser = await User.findAndCountAll({
            where: {
                [optionType]: value
            },
            offset: (pagenum - 1) * limitValue,
            limit: limitValue
        });
        // console.log(existingUser);
        if (existingUser) {
            res.json({
                status: 200,
                data: existingUser,
                pagination: {
                    currentPage: pagenum,
                    pageSize: pageSize,

                    // 一共有多少条记录
                    total: existingUser.count
                },
                msg: 'fetch User success'
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            data: [],
            msg: 'Internal Server Error'
        });
    }
};
module.exports = {
    login,
    getCVCode,
    register,
    getUserInfo,
    updateUserInfo,
    updateUserPwd,
    preFetchUser
};
