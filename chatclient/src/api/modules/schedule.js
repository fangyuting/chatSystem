import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    // 添加日程
    addEvent(data) {
        return request.post(`${API}/schedule/addEvent`, data);
    },
    // 获取日程
    getEvent(data) {
        let { account } = data;
        return request.get(`${API}/schedule/getEvent?account=${account}`);
    }
};
