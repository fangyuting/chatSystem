// 生成验证码
const cvCodeList = require('../const/index').cvCodeList;

const cvCode = () => {
    // 时间戳
    const timestamp = Date.now();
    // 验证码
    let code = '';
    for (let i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * cvCodeList.length);
        if (cvCodeList[random] == undefined) {
            i--;
        } else {
            code += cvCodeList[random];
        }
    }
    return { code, timestamp };
};
module.exports = {
    cvCode
};
