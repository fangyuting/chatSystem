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
// var path = require('path');

// const options = {
//     setHeaders(res, path, stat) {
//         res.set('Access-Control-Allow-Origin', '*');
//     }
// };

// 解析请求体中的 JSON 数据
app.use(express.json());
// 解析请求体中的 URL 编码表单数据
app.use(express.urlencoded({ extended: false }));
// app.use(express.static('public'));
app.use(express.static('/src/public'));

const useMiddleware = require('./src/middleware');

// 导入路由模块
const user = require('./src/routes/user');
const schedule = require('./src/routes/schedule');
const validate = require('./src/routes/validateNews');
const group = require('./src/routes/group');
const friendlies = require('./src/routes/friendlies');
const pyqNews = require('./src/routes/pyqNews');
const pyqLike = require('./src/routes/pyqLike');
const pyqComments = require('./src/routes/pyqComments');
const blog = require('./src/routes/blog');
const news = require('./src/routes/news');

// 使用 app.use() 注册路由模块
app.use(`${API_VERSION}/user`, user);
app.use(`${API_VERSION}/schedule`, schedule);
app.use(`${API_VERSION}/validate`, validate);
app.use(`${API_VERSION}/group`, group);
app.use(`${API_VERSION}/friendlies`, friendlies);
app.use(`${API_VERSION}/pyqNews`, pyqNews);
app.use(`${API_VERSION}/pyqLike`, pyqLike);
app.use(`${API_VERSION}/pyqComments`, pyqComments);
app.use(`${API_VERSION}/blog`, blog);
app.use(`${API_VERSION}/news`, news);

const { insertValidateNews, changeValidateNewsStatus } = require('./src/controller/validateNews');
const { addFriend } = require('./src/controller/friendlies');
const { addNewGroupUser } = require('./src/controller/group');
// const { deleteUserInFenzu } = require('./src/controller/user');
/**中间件使用 */
useMiddleware(app);

io.on('connection', function (socket) {
    console.log('>>>客户端新上线用户连接成功');
    console.log('A user connected with ID:', socket.id);
    // 监听用户登录事件
    socket.on('login', (data) => {
        console.log('用户登录：', data);
        socket.emit('login', '登录成功');
        // socket.name = data.name;
        // console.log('a user connected');
    });
    // 前后端打招呼
    socket.on('hello', (val) => {
        console.log('收到前端的hello:>> ', val);
        socket.emit('hello', '我收到了');
    });

    // 给客户端发送消息（发布welcome事件）
    socket.emit('welcome', '欢迎连接socket');
    socket.emit('linkSuccess', '是的没错你连接成功了!');

    // 发送好友申请验证信息
    socket.on('sendValidateMessage', (val) => {
        console.log('sendValidateMessage :>> ', val);
        insertValidateNews(val);
        socket.emit('sendValidateMessage', '添加请求发送成功了！');
    });

    // 好友同意申请
    socket.on('sendAgreeFriendValidate', (data) => {
        console.log('sendAgreeFriendValidate :>> ', data);

        const friend = {
            reveiverId: data.reveiverId,
            senderId: data.senderId,
            validateType: '0'
        };
        changeValidateNewsStatus(friend, '1'); // 用户同意加好友之后改变验证消息的状态

        // 将好友添加进好友列表
        addFriend(friend);

        socket.emit('sendAgreeFriendValidate', '同意申请发送成功');
    });

    socket.on('sendAgreeGroupValidate', (data) => {
        const group = {
            groupId: data.groupId,
            senderId: data.senderId,
            senderName: data.senderName,
            validateType: '1'
        };
        changeValidateNewsStatus(group, '1'); // 用户同意加好友之后改变验证消息的状态});

        // 将用户添加进群用户列表
        addNewGroupUser(group);
        socket.emit('sendAgreeGroupValidate', '同意申请发送成功');
    });

    // socket.on('deleteFriendInFenzu', (data) => {
    //     const val = {
    //         userY: data.chooseUserId,
    //         userM: data.userId
    //     };
    //     console.log(val);
    //     deleteUserInFenzu(val);
    //     socket.emit('deleteFriendInFenzu', '删除分组好友信息成功');
    // });
    /* socket实例对象会监听一个特殊函数，关闭连接的函数disconnect */
    socket.on('disconnect', function () {
        console.log('用户关闭连接');
    });
});

// 指定本地服务ip地址，开启本地服务端口
httpServer.listen(8888, (err) => {
    if (!err) console.log('Server is running,http://127.0.0.1:8888/');
});
