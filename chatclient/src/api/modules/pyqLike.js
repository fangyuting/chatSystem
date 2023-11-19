import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    doLike(data) {
        return request.post(`${API}/pyqLike/doLike`, data);
    }
};
