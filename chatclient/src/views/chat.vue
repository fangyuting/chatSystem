<template>
    <div class="chat">
        <!-- 侧边栏 -->
        <!-- <router-link> 的 to 属性指定的地址决定了哪个组件会在 <router-view> 中渲染 -->
        <div class="aside">
            <div class="avatar">
                <router-link to="/chat/chatHome">
                    <img src="../../static/image/touxiang.jpg" alt="" />
                </router-link>
                <span>{{ userInfo.name }}</span>
            </div>
            <div class="nav-list">
                <router-link to="/chat/add" tag="span" title="加好友">
                    <span class="nav-item iconfont icon-icon-"></span>
                </router-link>
                <router-link to="/chat/mzone" tag="span" title="空间">
                    <span class="nav-item iconfont icon-icon-test1"></span>
                </router-link>
            </div>
            <div class="about-list">
                <a href="https://github.com/CCZX/wechat" target="_blank" title="github">
                    <svg
                        t="1586172201730"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2278"
                        width="20"
                        height="20"
                    >
                        <path
                            d="M0 524.992q0 166.016 95.488 298.496t247.488 185.504q6.016 0.992 10.016 0.992t6.496-1.504 4-3.008 2.016-4.992 0.512-4.992v-100.512q-36.992 4-66.016-0.512t-45.504-14.016-28.992-23.488-16.992-25.504-8.992-24-5.504-14.496q-8.992-15.008-27.008-27.488t-27.008-20-2.016-14.496q50.016-26.016 112.992 66.016 34.016 51.008 119.008 30.016 10.016-40.992 40-70.016Q293.984 736 237.984 670.976t-56-158.016q0-87.008 55.008-151.008-22.016-64.992 6.016-136.992 28.992-2.016 64.992 11.488t50.496 23.008 25.504 17.504q56.992-16 128.512-16t129.504 16q12.992-8.992 28.992-19.008t48.992-21.504 60.992-9.504q27.008 71.008 7.008 135.008 56 64 56 151.008 0 92.992-56.992 158.496t-172 85.504q43.008 43.008 43.008 104v128.992q0 0.992 0.992 3.008 0 6.016 0.512 8.992t4.512 6.016 12 3.008q152.992-52 250.496-185.504t97.504-300.512q0-104-40.512-199.008t-108.992-163.488-163.488-108.992T512.032 12.96 313.024 53.472 149.536 162.464t-108.992 163.488-40.512 199.008z"
                            p-id="2279"
                        ></path>
                    </svg>
                </a>
            </div>
            <div class="operation">
                <el-dropdown placement="left">
                    <span class="el-dropdown-link">
                        <i class="open-item el-icon-s-operation"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <router-link to="/chat/setting" class="aside-menu-link">
                                <el-button type="text">个人设置</el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <router-link to="/chat/system" class="aside-menu-link">
                                <el-button type="text">系统消息</el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="setShowTheme(true)">主题设置</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text">反馈</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="logout">退出登录</el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="chat-detail">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import { removeCookie } from '@/utils/token';

    export default {
        name: 'chat',
        data() {
            return {};
        },
        computed: {
            userInfo() {
                return this.$store.state.user.userInfo;
            }
        },
        methods: {
            logout() {
                this.$router.push('/');
                this.$store.dispatch('user/LOGOUT');
                removeCookie();
                this.$notify({
                    title: `Logout`,
                    message: '退出登录',
                    type: 'success',
                    showClose: false,
                    duration: 2000
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import '../../static/iconfont/iconfont.css';
    .chat {
        min-width: 62.5rem; /* 设置最小宽度,防止因缩放导致内容挤压 */
        width: 100vw;
        height: 100vh;
        .aside {
            float: left;
            width: 4.375rem;
            height: 100%;
            background-color: white;
            border-right: 0.0625rem solid rgba(173, 171, 171, 0.3);

            .avatar {
                font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                padding-top: 0.9375rem;
                img {
                    width: 3.125rem;
                    height: 3.125rem;
                    border-radius: 0.375rem;
                }
            }
            .nav-list {
                margin-top: 1.875rem;
                .nav-item {
                    display: block;
                    color: #000;
                    margin-top: 1.25rem;
                    font-size: 1.25rem;
                    cursor: pointer;
                }
            }
            .about-list {
                margin-top: 150px;
            }
            .operation {
                position: absolute;
                bottom: 2.5rem;
                width: 4.375rem;
                margin: auto;

                .open-item {
                    font-size: 1.875rem;

                    .menu-item {
                        display: block;
                    }
                }
            }
        }
        /* .user-list {
            float: left;
            width: 15.625rem;
            height: 100%;

            border-right: 0.0625rem solid #959595;
        } */
        .chat-detail {
            margin: auto;
            height: 100%;
            margin-left: 4.375rem;
        }
    }
</style>
