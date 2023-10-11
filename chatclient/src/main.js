import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '../static/css/base.css';

// const socket = io('/socket');
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';

// socket连接
Vue.use(
    new VueSocketIO({
        debug: true, // debug调试，生产建议关闭
        connection: SocketIO('http://localhost:8888', {
            transports: ['websocket']
            // autoConnect: false
        })
        // options: {
        //     autoConnect: false // 关闭自动连接，在用户登录后在连接
        // }
    })
);

import FullCalendar from 'vue-fullcalendar';
Vue.use(FullCalendar);

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
    el: '#app', // el 用于指定当前Vue实例为哪个容器服务
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
