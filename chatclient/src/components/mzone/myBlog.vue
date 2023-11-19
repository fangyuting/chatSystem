<template>
    <div class="myBlog">
        <router-link to="/chat/addBlog">
            <el-button type="primary" class="addBlog">写博客</el-button>
        </router-link>
        <div class="mid"></div>
        <transition-group name="slide-fade" mode="slide-fade" class="blogList-transition">
            <div
                v-for="(item, blogIndex) in blogList"
                :key="blogIndex"
                class="blogList"
                @click="blogDetail(item.id)"
            >
                <router-link class="blog-link" :to="`/chat/blog/${item.id}`">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="点击查看博客详情"
                        placement="right-end"
                    >
                        <div>
                            <div class="header">
                                <!-- <img src="../../../static/image/touxiang.jpg" alt="" /> -->
                                <!-- <div class="info"> -->
                                <span class="name">{{ item.authorName }}</span>
                                <span class="date">{{ item.updateDate }}</span>
                                <!-- </div> -->
                            </div>

                            <!-- <div class="content"> -->
                            <div class="title">{{ item.title }}</div>
                            <!-- <span>{{ item.desc }}</span> -->
                            <!-- </div> -->
                        </div>
                    </el-tooltip>
                </router-link>
            </div>
        </transition-group>
    </div>
</template>

<script>
    import api from '../../api';
    import { Message } from 'element-ui';
    export default {
        data() {
            return {
                userId: '',
                blogList: []
            };
        },
        methods: {
            getBlog() {
                const userId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                api.blog.getBlog(userId).then((res) => {
                    // console.log(res);
                    if (res.status == 200) {
                        // console.log(res.data);
                        this.blogList = res.data;
                    }
                });
            },
            blogDetail(id) {
                // console.log(id);
            }
        },
        created() {
            this.getBlog();
        }
    };
</script>

<style lang="scss" scoped>
    .myBlog {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        .addBlog {
            /* float: left;
                margin-left: 20px; */
            position: absolute;
            left: 81px;
            margin-bottom: 100px;
        }
        .mid {
            height: 100px;
        }
        .blogList-transition {
            width: 90%;
            margin-bottom: 20px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .blogList {
                width: 200px;
                margin: 0 25px 15px 25px;
                padding: 14px;
                border: 1px solid #dddcdc;
                border-radius: 5px;
                .blog-link {
                    text-decoration: none;
                    color: #000;
                    .header {
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        padding: 5px 0;

                        .name {
                            font-size: 16px;
                            font-weight: 600;
                            margin-right: 20px;
                        }
                        .date {
                            font-size: 14px;
                            color: #909399;
                        }
                        /* } */
                    }
                }
            }
            .blogList:hover {
                -webkit-transform: translateY(-3px);
                -ms-transform: translateY(-3px);
                transform: translateY(-3px);
                -webkit-box-shadow: 0 0 6px #999;
                box-shadow: 0 0 6px #999;
                -webkit-transition: all 0.5s ease-out;
                transition: all 0.5s ease-out;
                border-radius: 5px;
                cursor: pointer;
            }
            .title {
                margin: 10px 0;
                text-align: left;
                height: 100px;
            }
        }
        .slide-fade-enter-active {
            transition: all 0.5s ease;
        }
        .slide-fade-leave-active {
            transition: all 0.5s cubic-bezier(0.57, 0.86, 1, 0.54);
        }
        .slide-fade-enter,
        .slide-fade-leave-to {
            transform: translateX(30px);
            opacity: 0;
        }
    }
</style>
