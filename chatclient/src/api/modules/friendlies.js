import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    getMyFriends(data) {
        return request.get(`${API}/friendlies/getMyFriends?id=${data}`);
    },

    // 删除好友
    deleteFriend(data) {
        return request.post(`${API}/friendlies/deleteFriend`, data);
    }
};
