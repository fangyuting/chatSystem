import user from './modules/user';
import schedule from './modules/schedule';
import validateNews from './modules/validateNews';
import group from './modules/group';
import friendlies from './modules/friendlies';
import pyqNews from './modules/pyqNews';
import pyqLike from './modules/pyqLike';
import pyqComments from './modules/pyqComments';
import blog from './modules/blog';
import request from '@/utils/request';
export const API = 'api/v1';

export default {
    user,
    schedule,
    validateNews,
    group,
    friendlies,
    pyqNews,
    pyqLike,
    pyqComments,
    blog
};
