const db = require('../utils/connectDB');
const { Schedule } = require('../models/schedule');

// 添加日程
const addEvent = async (req, res) => {
    const { title, start, end, cssClass, account } = req.body;
    console.log(req.body);
    try {
        const newSchedule = await Schedule.create({
            name: account,
            title: title,
            start: startMoment,
            end: endMoment,
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
    let { account } = req.query;
    console.log(account);

    const events = await Schedule.findAll({
        where: {
            name: account
        }
    });
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
