<template>
    <div class="blogDetail">
        <div class="header">
            <img src="../../../static/image/touxiang.jpg" alt="" />
            <!-- <div class="info"> -->
            <span class="name">{{ blogInfo.authorName }}</span>
            <i class="date">{{ blogInfo.updateDate }}</i>
            <!-- </div> -->
            <div class="edit">
                <!-- 
                    在query传参的时候可能会遇到一个问题：
                            当传递参数为对象时，第一次跳转数据是没问题的，但第二次刷新页面数据会变为[object object]
                    {blogInfo: '[object Object]', flag: '1', blogId: 'df424bd0-838f-11ee-88ca-99b49075c4b2'} 
                    解决办法：
                            要跳转的传参页：先将数组转换为字符串    JSON.stringify()
                -->
                <router-link
                    :to="{
                        path: '/chat/addBlog',
                        query: { blogInfo: JSON.stringify(blogInfo), flag: 1, blogId: blogId }
                    }"
                >
                    <el-button type="primary">编辑</el-button>
                </router-link>
            </div>
        </div>

        <div class="content">
            <h1 class="title">
                {{ blogInfo.title }}
            </h1>
            <!-- <div class="main">
                {{ blogInfo.content }}
            </div> -->
            <div v-html="markdownToHtml" class="markdown-body"></div>
        </div>
    </div>
</template>
<script>
    import marked from 'marked';
    import 'github-markdown-css';
    import hljs from 'highlight.js';
    import 'highlight.js/styles/atom-one-light.css';
    import api from '../../api';
    import { Message } from 'element-ui';
    export default {
        name: 'blogDetail',
        data() {
            return {
                blogInfo: [],
                blogId: ''
            };
        },
        computed: {
            markdownToHtml() {
                if (this.blogInfo && this.blogInfo.content) {
                    return marked(this.blogInfo.content);
                }
                return ''; // 或其他默认值
            }
        },
        watch: {},
        async mounted() {
            await this.getBlogDetail();
            // 代码高亮
            var rendererMD = new marked.Renderer();
            marked.setOptions({
                renderer: rendererMD,
                highlight: function (code) {
                    return hljs.highlightAuto(code).value;
                },
                pedantic: false,
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
            });
            this.blogInfo.content = marked(this.blogInfo.content);
        },
        created() {
            // this.$nextTick(() => {
            //     hljs.highlightAll();
            // });
        },
        methods: {
            async getBlogDetail() {
                const blogId = this.$route.params.id;
                this.blogId = blogId;
                // console.log(blogId);
                await api.blog.getBlogDetailById(blogId).then((res) => {
                    if (res.status == 200) {
                        console.log(res.data);
                        this.blogInfo = res.data;
                        console.log(this.blogInfo);
                    }
                });
            }
        }
    };
</script>
<style lang="scss">
    .blogDetail {
        /* width: 100%; */
        background-color: #fff;
        height: 95%;
        display: flex;
        flex-direction: column;
        margin: 20px;
        border-radius: 5px;
        box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        overflow: auto;

        .header {
            display: flex;
            flex-direction: row;
            margin: 50px 0 0 50px;
            align-items: center;
            height: 80px;
            /* width: 100%; */
            border-bottom: 1px solid #dddcdc;
            position: relative;
            padding-bottom: 10px;
            img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
            .name {
                font-size: 20px;
                font-weight: 600;
                margin: 0 20px 0 20px;
            }
            .date {
                color: #909399;
            }
            .edit {
                position: absolute;
                right: 50px;
            }
        }
        .content {
            text-align: left;
            margin: 30px 0 0 50px;
            padding-bottom: 30px;
            .title {
                padding-bottom: 30px;
            }
        }
    }
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0;
    }

    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-thumb {
        cursor: pointer;
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.15);
        transition: color 0.2s ease;
    }
</style>
