import request from '@/utils/request'; // 引入封装的axios
import { API } from '../index';

export default {
    // 添加博客
    addBlog(data) {
        return request.post(`${API}/blog/addBlog`, data);
    },
    // 获取博客列表
    getBlog(data) {
        return request.get(`${API}/blog/getBlog?userId=${data}`);
    },
    // 根据博客Id获取博客详细信息
    getBlogDetailById(data) {
        return request.get(`${API}/blog/getBlogDetailById?blogId=${data}`);
    },
    // 更新博客内容
    updateBlog(data) {
        return request.post(`${API}/blog/updateBlog`, data);
    }
};
