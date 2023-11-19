import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    // 获取好友动态
    getMyFriendPyqNews(data) {
        console.log(data);
        return request.get(`${API}/pyqNews/getMyNews?id=${data}`);
    },

    // 添加新的动态
    addNewStory(data) {
        return request.post(`${API}/pyqNews/addNewStory`, data);
    },

    // 获取我的动态
    getMyMzone(data) {
        return request.get(`${API}/pyqNews/getMyMzone?id=${data}`);
    },

    deleteMyMzone(data) {
        return request.post(`${API}/pyqNews/deleteMyMzone`, data);
    }
};
