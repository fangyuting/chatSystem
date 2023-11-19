<template>
    <div class="addNewStory">
        <div class="story">
            <textarea type="text" placeholder="发表新的动态" v-model="story" />
            <div class="tools">
                <i class="icon-emoji iconfont"></i>
                <i class="icon-tianjiatupian_huaban iconfont"></i>
            </div>
            <button class="submit" @click="submit">发表</button>
            <button class="clear">清空</button>
        </div>
    </div>
</template>
<script>
    import { Message } from 'element-ui';
    import api from '../../api';
    export default {
        name: 'addNewStory',
        data() {
            return {
                story: '', // 新动态内容
                pictures: [] // 图片
            };
        },
        props: {
            refreshPyqNews: Function
        },
        computed: {},
        mounted() {},
        methods: {
            // 发布新动态
            submit() {
                const userId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                // console.log(this.userId);
                if (this.story.trim() !== '') {
                    // console.log(this.story);
                    const params = {
                        userId: userId,
                        content: this.story,
                        pictures: this.pictures
                    };
                    api.pyqNews.addNewStory(params).then((res) => {
                        // console.log(res);
                        if (res.status == 200) {
                            Message({
                                message: '添加动态成功',
                                type: 'success'
                            });
                            this.story = '';
                            this.refreshPyqNews(); // 调用父组件的方法
                            // console.log('1');
                        }
                    });
                } else {
                    Message({
                        message: '动态内容不能为空',
                        type: 'warning'
                    });
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import '../../../static/iconfont/iconfont.css';

    .addNewStory {
        /* width: 100%; */
        height: 100px;

        .story {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            position: relative;
            textarea {
                height: 100px;
                width: 100%;
                display: inline-block;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                outline: none;
                border: 1px solid #dbdbdb;
                border-radius: 4px;
                padding: 10px;
                resize: none;
                /* border: none; */
            }
            .tools {
                position: absolute;
                right: 175px;
                bottom: 10px;
                i {
                    font-size: 22px;
                    cursor: pointer;
                    margin-right: 15px;
                }
                i:hover {
                    color: #605bff;
                }
            }
            .submit,
            .clear {
                width: 80px;
                margin-left: 20px;
                height: 100px;
                border-radius: 4px;
                border: none;
                cursor: pointer;
            }
            .submit {
                background-color: #605bff;
                color: #fff;
            }
            .clear {
                color: #000;
            }
        }
    }
</style>
