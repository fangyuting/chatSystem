// 对axios进行二次封装用它来发送网络请求调接口
import axios from 'axios';
import { Message } from 'element-ui';
import router from './../router';
import { getCookie, setCookie, removeCookie } from './token';
import store from '@/store';

import nprogress from 'nprogress'; // start: 进度条开始 end: 进度条结束
import 'nprogress/nprogress.css';
// 创建全局 axios 实例 requests 用于发送网络请求
let requests = axios.create({
    // 发请求时都带上 /api
    // baseURL:'/api'
    // 5秒之内无反应则自动请求失败
    timeout: 5000,
    headers: {
        // 为了不进行预处理请求需要用这样格式的数据
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    /*
        baseURL: '/' 表示你的请求将被发送到当前网站的根路径下
        axios 将使用 baseURL 和相对路径 /some-endpoint 来构建请求 URL，
        最终请求的 URL 就是根路径加上相对路径，如 http://your-server-url/some-endpoint，
        这个 URL 将被用于发送请求到服务器。

        baseURL 被设置为 /，这意味着所有请求的基本路径是你的应用的根路径。假设你的网站部署在 http://localhost:8888，
        那么 / 就代表 http://localhost:8888。所以，当你发送请求时使用 /api/v1，实际上是在访问 http://localhost:8888/api/v1

        baseURL 的设置为应用的根路径，配合自定义的 request.get() 函数，
        使得在发送请求时，你可以使用相对路径，而不必担心完整的URL构建，这提高了代码的可读性和可维护性。

        baseURL是前端应用程序发送请求时的基本路径
     */
    baseURL: '/'
});

// 请求拦截器: 在发送请求之前可以检测到，可以在请求发送出去之前做一些事情
// 向后端发送请求 从cookie里找token 放到header里 发送请求的时候带着 验证身份
requests.interceptors.request.use(
    (config) => {
        // 检查是否存在登录 token
        const token = getCookie();
        // console.log('查看有没有token', token);
        if (token) {
            // 将token添加到请求头中,以实现身份验证
            config.headers.Authorization = token;
            // config: 配置对象,对象里面有一个属性很重要 headers 请求头
            return config;
        }
        // 进度条开始
        nprogress.start();
        return config;
    },
    (err) => {
        Promise.reject(err);
    }
);

// 响应拦截器: 拦截服务器响应，并在收到响应后执行一些操作
requests.interceptors.response.use(
    (res) => {
        // console.log('看看现在什么状态', res.data.status);
        // 处理不同状态码的响应
        if (res.data.status === 1000 || res.status === 1000) {
            setCookie(res.data.token);
        }
        if (res.data.status === 2002 || res.status === 2002) {
            // 未登录
            Message({
                message: '请先登录',
                type: 'warning',
                duration: 3000
            });
            if (router.currentRoute.path !== '/chatLogin') {
                // router.push(targetRoute);
                router.push('/chatLogin');
            }
        } else if (res.data.status === 2003 || res.status === 2003) {
            Message({
                message: '服务端错误,请稍后重试',
                type: 'error',
                duration: 3000
            });
        }
        // 1006 账户冻结
        else if (res.data.status === 1006 || res.status === 1006) {
            Message({
                message: '登录过期',
                type: 'warning',
                duration: 3000
            });
            // 清除cookie 清除缓存中的 userInfo 和 isLogin 跳转到 chatLogin 页面 确保输入账号密码才能再次进入 而不是修改ip就行
            removeCookie();
            console.log('router.currentRoute.path', router.currentRoute.path);
            if (router.currentRoute.path !== '/chatLogin') {
                // router.push(targetRoute);
                router.push('/chatLogin');
            }
            // store.dispatch('user/LOGOUT');
        } else if (res.data.status === 1002 && res.data.data === 'overdue') {
            Message({
                message: '验证码过期！',
                type: 'warning',
                duration: 3000
            });
        } else {
            console.log('wowow');
        }
        // 进度条结束
        nprogress.done();
        // 成功的回调函数: 服务器相应数据回来后,响应拦截器可以检测到,可以做的事情

        return res.data;
    },
    (error) => {
        console.log('请求错误', error);
        Message({
            message: '网络超时！',
            type: 'error',
            duration: 5000
        });
        // 失败的回调函数
        return Promise.reject(error);
    }
);

export default requests;
