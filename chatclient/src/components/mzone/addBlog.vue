<template>
    <div class="addBlog">
        <div class="title">
            <el-input v-model="blogTitle"></el-input>
            <el-button type="primary" class="submit" @click="submit">发表博客</el-button>
        </div>
        <mavon-editor v-model="content" class="editor" />
        <i class="back" @click="back">返回</i>
    </div>
</template>

<script>
    import api from '../../api';
    import { Message } from 'element-ui';
    export default {
        name: 'addBlog',
        data() {
            return {
                content: '',
                blogTitle: '',
                userId: '',
                flag: 0,
                copyTitle: '',
                blogId: ''
            };
        },
        methods: {
            // 发表博客
            submit() {
                console.log('blogTitle', this.blogTitle);
                console.log('content', this.content);
                console.log('flag', this.flag);
                console.log('query', this.$route.query);
                if (this.blogTitle.trim() !== '') {
                    if (this.content.trim() !== '') {
                        /**
                         * 1. 添加新的博客 不是修改博客
                         * 2. 修改博客 title没有改变
                         *            200 修改成功
                         *            1007 这条博客已经被删除 重新发送一条新的博客? 是/否
                         *                  是  作为新的博客发送
                         *                  否  取消发送 回到首页
                         * 3. 修改博客 title改变了
                         *            重新发送一条新的博客? 是/否
                         *              是  作为新的博客发送
                         *              否  不修改返回到这条博客
                         *
                         */
                        const userId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                        this.userId = userId;
                        if (this.flag == 0) {
                            const params = {
                                authorId: userId,
                                title: this.blogTitle,
                                content: this.content
                            };
                            if (this.blogTitle == this.copyTitle) {
                                this.flag = 1;
                                this.submit();
                            } else {
                                api.blog.addBlog(params).then((res) => {
                                    console.log(res);
                                    if (res.status == 200) {
                                        Message({
                                            message: '发布成功',
                                            type: 'success'
                                        });
                                        this.blogTitle = '';
                                        this.content = '';
                                        this.$router.replace({ path: '/chat/mzone' });
                                    } else if (res.status == 1003) {
                                        Message({
                                            message: res.msg,
                                            type: 'error'
                                        });
                                        this.blogTitle = '';
                                    }
                                });
                            }
                        } else if (this.flag == 1 && this.blogTitle == this.copyTitle) {
                            const params = {
                                title: this.blogTitle,
                                content: this.content
                            };
                            api.blog.updateBlog(params).then((res) => {
                                if (res.status == 200) {
                                    Message({
                                        message: '内容更新成功',
                                        type: 'success'
                                    });
                                    this.blogTitle = '';
                                    this.content = '';
                                    this.flag = 0;
                                    this.$router.go(-1);
                                } else if (res.status == 1007) {
                                    this.$confirm(
                                        '该条博客已被删除,无法修改,是否需要重新发送?',
                                        '警告',
                                        {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                        }
                                    )
                                        .then(() => {
                                            this.flag = 0;
                                            this.submit();
                                        })
                                        .catch(() => {
                                            this.flag = 0;
                                            this.$router.replace({ path: '/chat/mzone' });
                                        });
                                }
                            });
                        } else if (this.flag == 1 && this.blogTitle != this.copyTitle) {
                            this.$confirm('该条博客名已修改,是否提交一条新的博客', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            })
                                .then(() => {
                                    this.flag = 0;
                                    this.submit();
                                })
                                .catch(() => {
                                    // const params = {
                                    //     authorId: userId,
                                    //     title: this.blogTitle,
                                    //     content: this.content
                                    // };
                                    // api.blog.updateBlog(params).then((res) => {
                                    //     if (res.status == 200) {
                                    //         Message({
                                    //             message: '内容更新成功',
                                    //             type: 'success'
                                    //         });
                                    //         this.$router.go(-1);
                                    //         this.flag = 0;
                                    //     } else if (res.status == 1007) {
                                    //         this.$confirm(
                                    //             '该条博客已被删除,无法修改,是否需要重新发送?',
                                    //             '警告',
                                    //             {
                                    //                 confirmButtonText: '确定',
                                    //                 cancelButtonText: '取消',
                                    //                 type: 'warning'
                                    //             }
                                    //         )
                                    //             .then(() => {
                                    //                 this.flag = 0;
                                    //                 this.submit();
                                    //             })
                                    //             .catch(() => {
                                    //                 this.flag = 0;
                                    //                 this.$router.replace({ path: '/chat/mzone' });
                                    //             });
                                    //     }
                                    // });
                                    this.flag = 0;
                                    Message({
                                        type: 'info',
                                        message: '已取消修改'
                                    });
                                    this.$router.go(-1);
                                });
                        }
                    } else {
                        Message({
                            message: '内容不可为空',
                            type: 'warning'
                        });
                        // this.content = '';
                    }
                } else {
                    Message({
                        message: '标题不可为空',
                        type: 'warning'
                    });
                    // this.blogTitle = '';
                }
            },
            // 退出编辑
            back() {
                this.$router.go(-1);
            },

            getBlogInfo() {
                if (this.$route.query.flag == 1) {
                    this.content = JSON.parse(this.$route.query.blogInfo).content;
                    this.blogTitle = JSON.parse(this.$route.query.blogInfo).title;
                    this.copyTitle = JSON.parse(this.$route.query.blogInfo).title;
                    this.flag = 1;
                    this.blogId = this.$route.query.blogId;
                    console.log('finish');
                } else {
                    this.flag = 0;
                }
                // console.log('blogInfo', this.$route.query.blogInfo);
                // console.log(this.$route.query.flag);
                // console.log('content', this.content);
            }
        },
        /**
         *
         * 当页面刷新时,Vue 应用会重新初始化，但是当前路由仍然是之前的路由，
         * 因此路由参数 $route.query 在页面刷新后会保留其值(对象类型除外,需要先转换为字符串 ),因此组件不会重新创建,也就不会触发 created 钩子的再次执行。
         * 在页面刷新后,Vue 会重新创建根实例和挂载路由，
         * 但不会重新触发组件的 created 生命周期钩子。所以,如果页面刷新后你希望执行某些操作,可以考虑在 mounted 钩子中进行。
         * created 生命周期钩子在 Vue 组件生命周期中只会在组件实例被创建后调用一次，不会在页面刷新时重新执行.
         * Vue 组件的生命周期钩子中,created 在实例创建完成后立即调用,适合进行初始数据的获取和简单的初始化操作。
         * 而在页面刷新后,如果需要在组件重新渲染后执行操作,可以使用 mounted 钩子,
         * 因为 mounted 钩子会在组件挂载到 DOM 后执行，无论是初始化渲染还是页面刷新后都会触发。
         *
         */

        // created() {
        //     this.getBlogInfo();
        //     console.log('query', this.$route.query);
        // },
        mounted() {
            this.getBlogInfo();
        }
    };
</script>

<style lang="scss" scoped>
    .addBlog {
        height: 100%;
        display: flex;
        flex-direction: column;
        /* margin-bottom: 10px; */
        /* box-sizing: border-box; */
        align-items: stretch;
        .title {
            display: flex;
            flex-direction: row;
            margin: 20px 17px 0 17px;

            .submit {
                width: 100px;
                margin-left: 20px;
                /* margin-bottom: 15px; */
                /* position: relative;
                left: 1000px; */
            }
        }

        .editor {
            height: 95%;
            margin: 20px 17px;
        }
        /deep/ .v-note-wrapper {
            min-height: 370px;
        }
        .back {
            padding: 5px;
            float: left;
            width: 42px;
            margin: 0 0 17px 15px;
            color: #979797;
            cursor: pointer;
        }
        .back:hover {
            text-decoration: underline;
        }
    }
</style>
