// 导入 Express
const express = require('express');

// 创建 express 应用程序
const app = express();

const API_VERSION = require('./src/const').API_VERSION;

const { createServer } = require('http');
const { Server } = require('socket.io');
// socket.io
const httpServer = createServer(app);
// const http = require('http').createServer(app);
const io = new Server(httpServer, {
    allowEIO3: true,
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// 解析请求体中的 JSON 数据
app.use(express.json());
// 解析请求体中的 URL 编码表单数据
app.use(express.urlencoded({ extended: false }));

const useMiddleware = require('./src/middleware');

// 导入路由模块
const user = require('./src/routes/user');
const schedule = require('./src/routes/schedule');
// const { sendValidateMessage } = require('./src/routes/validateNews');

// 使用 app.use() 注册路由模块
app.use(`${API_VERSION}/user`, user);
app.use(`${API_VERSION}/schedule`, schedule);
// app.use(`${API_VERSION}/validateNews`, validateNews);
/**中间件使用 */
useMiddleware(app);

io.on('connection', function (socket) {
    console.log('>>>客户端新上线用户连接成功');
    console.log('A user connected with ID:', socket.id);
    /* 监听用户登录事件 */
    socket.on('login', (data) => {
        console.log('用户登录：', data);
        socket.emit('login', '登录成功');
        // socket.name = data.name;
        // console.log('a user connected');
    });
    socket.on('hello', (val) => {
        console.log('收到前端的hello:>> ', val);
    });
    socket.on('sendValidateMessage', (val) => {
        console.log('sendValidateMessage :>> ', val);
        socket.emit('sendValidateMessage', '添加请求发送成功了！');
    });

    // 给客户端发送消息（发布welcome事件）
    socket.emit('welcome', '欢迎连接socket');
    socket.emit('linkSuccess', '是的没错你连接成功了!');

    /* socket实例对象会监听一个特殊函数，关闭连接的函数disconnect */
    socket.on('disconnect', function () {
        console.log('用户关闭连接');
    });
});

// 指定本地服务ip地址，开启本地服务端口
httpServer.listen(8888, (err) => {
    if (!err) console.log('Server is running,http://127.0.0.1:8888/');
});
