import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '../static/css/base.css';

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
