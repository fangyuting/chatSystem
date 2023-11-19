import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    // sendValidateMessage(data) {
    //     const { senderId, senderNickname, senderName, senderAvatar, receiverId } = data;
    //     return request.get(
    //         `${API}/validateNews/sendValidateMessage?senderId=${senderId}&senderNickname=${senderNickname}&senderName=${senderName}&senderAvatar=${senderAvatar}&receiverId=${receiverId}`
    //     );
    // }

    getMyValidateNews(data) {
        const { reveiverId } = data;
        return request.get(`${API}/validate/getMyValidateNews?reveiverId=${reveiverId}`);
    }
};
