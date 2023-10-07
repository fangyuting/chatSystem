// 导入 Express
const express = require('express');
// 创建 express 应用程序
const app = express();
// const cors = require('cors');
// app.use(cors());

// 解析请求体中的 JSON 数据
app.use(express.json());
// 解析请求体中的 URL 编码表单数据
app.use(express.urlencoded({ extended: false }));

const API_VERSION = require('./src/const').API_VERSION;
const useMiddleware = require('./src/middleware');

// 导入路由模块
const user = require('./src/routes/user');
const schedule = require('./src/routes/schedule');
// 使用 app.use() 注册路由模块
app.use(`${API_VERSION}/user`, user);
app.use(`${API_VERSION}/schedule`, schedule);
/**中间件使用 */
useMiddleware(app);

// 指定本地服务ip地址，开启本地服务端口
app.listen(8888, (err) => {
    if (!err) console.log('Server is running,http://127.0.0.1:8888/');
});
