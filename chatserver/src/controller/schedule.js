const db = require('../utils/connectDB');
const { Schedule } = require('../models/schedule');
const { createToken, parseToken } = require('../utils/authorization');

// 添加日程
const addEvent = async (req, res) => {
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
    const { title, start, end, cssClass, account } = req.body;
    // console.log('1');
    // console.log(req.body);
    try {
        const newSchedule = await Schedule.create({
            name: account,
            title: title,
            start: start,
            end: end,
            cssClass: cssClass
        });
        return res.json({
            status: 200,
            data: newSchedule,
            msg: '日程添加成功'
        });
    } catch (err) {
        console.log(err.message);
        return res.json({
            status: 1004,
            data: '',
            msg: 'what ? ? ? ? 有bug ! ! ! !'
        });
    }
};

// 获取日程
const getEvent = async (req, res) => {
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
    let { account } = req.query;
    // console.log('account', account);

    const events = await Schedule.findAll({
        where: {
            name: account
        }
    });
    // console.log(events);
    return res.json({
        status: 200,
        data: events,
        msg: 'getEvent success'
    });
};

module.exports = {
    addEvent,
    getEvent
};
