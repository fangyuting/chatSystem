// actions => mutations => state

/**
 *  1. 组件中读取`vuex`中的数据`$store.state.数据`
 *  2. 组件中修改`vuex`中的数据`$store.dispatch('action中的方法名',数据)`*
 *     或`$store.commit('mutations中的方法名',数据)`
 *  3. 若没有网络请求或其他业务逻辑，组件中也可越过`actions`，即不写`dispatch`，直接编写`commit`
 *
 */
// 用于响应组件中的动作
const actions = {
    LOGIN({ commit }, data) {
        commit('login', data);
    },
    LOGOUT({ commit }, data) {
        commit('logout', data);
    }
};

// 用于操作数据(state)
const mutations = {
    login(state, data) {
        state.isLogin = true;
        state.userInfo = data;
        let dataString = JSON.stringify(data);
        window.localStorage.setItem('userInfo', dataString);
        window.sessionStorage.setItem('isLogin', true);
    },
    logout(state) {
        (state.isLogin = false), (state.userInfo = '');
        window.localStorage.setItem('userInfo', '');
        window.sessionStorage.setItem('isLogin', false);
    }
};

// 用于存储数据
const state = {
    isLogin: JSON.parse(window.sessionStorage.getItem('isLogin') || 'false'),
    userInfo: JSON.parse(window.localStorage.getItem('userInfo') || '{}')
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
