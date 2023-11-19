import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    addComment(data) {
        const config = {
            headers: {
                'Content-Type': 'application/json' // 设置Content-Type为application/json
            }
        };
        return request.post(`${API}/pyqComments/addComment`, data, config);
    }
};
