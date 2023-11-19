import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    // 获取验证码
    getCVCode() {
        return request.get(`${API}/user/getCVCode`);
    },
    // 登录
    login(data) {
        return request.post(`${API}/user/login`, data);
    },
    // 注册
    register(data) {
        return request.post(`${API}/user/register`, data);
    },
    // 获取用户信息
    getUserInfo(id) {
        return request.get(`${API}/user/getUserInfo?UserId=${id}`);
    },
    // 更新用户信息
    updateUserInfo(data) {
        return request.post(`${API}/user/updateUserInfo`, data);
    },
    // 更新用户密码
    updateUserPwd(data) {
        return request.post(`${API}/user/updateUserPwd`, data);
    },
    // 获取指定用户列表
    preFetchUser(data) {
        let { optionType, value, pageSize, pagenum } = data;
        return request.get(
            `${API}/user/preFetchUser?optionType=${optionType}&value=${value}&pageSize=${pageSize}&pagenum=${pagenum}`
        );
    },
    // 添加新的分组
    addNewFenzu(data) {
        return request.post(`${API}/user/addNewFenzu`, data);
    },

    // 切换分组
    modifyFriendFenzu(data) {
        const config = {
            headers: {
                'Content-Type': 'application/json' // 设置Content-Type为application/json
            }
        };

        return request.post(`${API}/user/modifyFriendFenzu`, data, config);
        // return request.post(`${API}/user/modifyFriendFenzu`, data);
    }
};
