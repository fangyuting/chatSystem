import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    // 获取指定群组列表
    preFetchGroup(data) {
        let { optionType, value, pageSize, pagenum } = data;
        return request.get(
            `${API}/group/preFetchGroup?optionType=${optionType}&value=${value}&pageSize=${pageSize}&pagenum=${pagenum}`
        );
    },

    getMyGroup(data) {
        // let { userId } = data;
        // console.log('data', );
        return request.get(`${API}/group/getMyGroup?userId=${data}`);
    },

    addNewGroup(data) {
        return request.post(`${API}/group/addNewGroup`, data);
    }
};
