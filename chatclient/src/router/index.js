import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './../store';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/chatLogin',
            meta: {
                requiresAuth: true
            }
        },
        // 登录页
        {
            path: '/chatLogin',
            name: 'chatLogin',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ '@/views/chatLogin'),
            meta: {
                depth: 0.5
            }
        },
        {
            path: '/chat',
            name: 'Chat',
            component: () => import('@/views/Sidebar'),
            redirect: '/chat/chatHome',
            meta: {
                requiresAuth: true,
                keepAlive: true
            },
            children: [
                {
                    path: 'chatHome',
                    name: 'ChatHome',
                    component: () => import('@/views/chatHome'),
                    meta: {
                        requiresAuth: true,
                        keepAlive: true,
                        deepth: 1
                    }
                },
                {
                    path: 'add',
                    name: 'Add',
                    component: () => import('@/views/Add'),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: 'setting',
                    name: 'Setting',
                    component: () => import('@/views/Setting'),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: 'system',
                    name: 'System',
                    component: () => import('@/views/SystemNews'),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: 'mzone',
                    name: 'MZone',
                    component: () => import('@/views/MZone'),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: 'addBlog',
                    name: 'addBlog',
                    component: () => import('@/components/mzone/addBlog'),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: 'blog/:id',
                    name: 'blogDetail',
                    component: () => import('@/components/mzone/blogDetail'),
                    meta: {
                        requiresAuth: true
                    }
                },

                {
                    path: 'schedule',
                    name: 'Schedule',
                    component: () => import('@/views/schedule'),
                    meta: {
                        requiresAuth: true
                    }
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    /**tips:需要在钩子函数内读取登录状态 */
    const userIsLogin = store.state.user.isLogin;
    console.log(userIsLogin);
    if (to.meta.requiresAuth) {
        if (userIsLogin) {
            next();
        } else {
            alert('请先登录再进行此操作!');
            next({
                path: '/chatLogin',
                /** 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由 */
                query: { redirect: to.fullPath }
            });
        }
    } else {
        next();
    }
});

export default router;
