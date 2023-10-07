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
    updateUserPwd(data) {
        return request.post(`${API}/user/updateUserPwd`, data);
    }

    // getCVCode(data){
    //     return request({
    //         url:`${API}/user/getcvcode`,
    //         method:'GET',
    //         data
    //     })
    // }
};
