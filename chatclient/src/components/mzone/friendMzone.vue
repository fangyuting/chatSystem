<template>
    <div class="friendMzone">
        <div class="addNewStory">
            <addNewStory :refreshPyqNews="getMyFriendPyqNews"></addNewStory>
        </div>
        <transition-group name="slide" mode="out-in" class="pyqContent-transition">
            <div class="pyqContent" v-for="(item, pyqIndex) in pyqList" :key="item.id">
                <!-- 朋友圈好友信息 -->
                <div class="userInfo">
                    <img src="../../../static/image/touxiang.jpg" alt="" />
                    <div class="info">
                        <span class="name">{{ item.userName }}</span>
                        <span class="createTime">{{ item.createDate }}</span>
                    </div>
                </div>
                <div class="main">
                    <div class="content">
                        {{ item.content }}
                    </div>
                    <div class="footer">
                        <div class="readCount">阅读: {{ item.readCount }}</div>
                        <div class="operation">
                            <span
                                class="icon-icon iconfont"
                                @click="doLike(item.id, pyqIndex)"
                                :style="myLiked.includes(item.id) ? 'color:#605bff' : ''"
                            ></span>
                            <span
                                class="icon-pinglun iconfont"
                                @click="focusComment(item.id, pyqIndex)"
                            ></span>
                        </div>
                    </div>
                </div>

                <!-- 点赞列表区域 -->
                <div
                    class="likeList"
                    v-for="(value, index) in pyqIdList"
                    :key="index"
                    v-if="item.id == index"
                >
                    <i class="icon-icon iconfont"></i>
                    <div class="list">
                        <span v-for="(authorName, nameIndex) in pyqIdList[index]">
                            {{ authorName }}
                        </span>
                    </div>
                </div>

                <!-- 评论区域 -->
                <div class="commentList">
                    <!-- comment 每条评论  -->
                    <div
                        v-for="(comment, commentIndex) in pyqCommentList"
                        :key="commentIndex"
                        v-if="item.id == comment.pyqId"
                    >
                        <div v-if="comment.level == 0">
                            <div class="zero">
                                <img src="../../../static/image/touxiang.jpg" alt="" />
                                <div class="friendInfo">
                                    <span>{{ comment.authorName }} : {{ comment.content }}</span>
                                    <div class="footer">
                                        <span class="date">{{ comment.createDate }}</span>
                                        <span
                                            class="reply"
                                            @click="
                                                reply(
                                                    item.id,
                                                    1,
                                                    comment.id,
                                                    {
                                                        authorId: comment.authorId,
                                                        authorName: comment.authorName
                                                    },
                                                    pyqIndex
                                                )
                                            "
                                        >
                                            回复
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-for="(commentlevel1, index) in pyqCommentList"
                                v-if="
                                    item.id == commentlevel1.pyqId &&
                                    commentlevel1.level == 1 &&
                                    commentlevel1.parentId == comment.id
                                "
                                class="first"
                            >
                                <!-- <div class="first"> -->
                                <img src="../../../static/image/touxiang.jpg" alt="" />
                                <div class="friendInfo">
                                    <span>
                                        {{ commentlevel1.authorName }} :
                                        {{ commentlevel1.content }}
                                    </span>
                                    <div class="footer">
                                        <span class="date">{{ commentlevel1.createDate }}</span>
                                        <span
                                            class="reply"
                                            @click="
                                                reply(
                                                    item.id,
                                                    2,
                                                    comment.id,
                                                    {
                                                        authorId: commentlevel1.authorId,
                                                        authorName: commentlevel1.authorName
                                                    },
                                                    pyqIndex
                                                )
                                            "
                                        >
                                            回复
                                        </span>
                                    </div>
                                </div>
                                <!-- </div> -->
                            </div>
                            <div
                                v-for="(commentlevel2, index) in pyqCommentList"
                                v-if="
                                    item.id == commentlevel2.pyqId &&
                                    commentlevel2.level == 2 &&
                                    commentlevel2.parentId == comment.id
                                "
                                class="second"
                            >
                                <img src="../../../static/image/touxiang.jpg" alt="" />
                                <div class="friendInfo">
                                    <span>
                                        {{ commentlevel2.authorName }} reply
                                        {{ commentlevel2.replyToAuthorInfo.authorName }}:
                                        {{ commentlevel2.content }}
                                    </span>
                                    <div class="footer">
                                        <span class="date">{{ commentlevel2.createDate }}</span>
                                        <span
                                            class="reply"
                                            @click="
                                                reply(
                                                    item.id,
                                                    2,
                                                    comment.id,
                                                    {
                                                        authorId: commentlevel2.authorId,
                                                        authorName: commentlevel2.authorName
                                                    },
                                                    pyqIndex
                                                )
                                            "
                                        >
                                            回复
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="addComment">
                        <i v-model="preText[item.id]">{{ preText[item.id] }}</i>
                        <input
                            type="text"
                            placeholder="说点什么吧~"
                            ref="inputRef"
                            v-model="comment[item.id]"
                            @blur="onBlur(item.id)"
                            @focus="onFocus(item.id)"
                        />
                        <i class="icon-emoji iconfont"></i>
                        <button @click="addComment(item.id)">submit</button>
                    </div>
                </div>
            </div>
        </transition-group>
    </div>
</template>
<script>
    import api from '../../api';
    import { Message } from 'element-ui';
    import addNewStory from './addMyNewStory';
    export default {
        name: 'friendMzone',
        data() {
            return {
                userId: '',
                pyqList: [], // 朋友圈列表
                pyqLikeList: [], // 点赞列表
                pyqCommentList: [], // 评论列表
                myLiked: [], // 我点过赞的
                pyqIdList: [], // 点赞好友列表
                comment: {}, // 评论
                level: 0,
                parentId: '',
                preText: {},
                replyComment: {}
            };
        },
        computed: {},
        components: {
            addNewStory
        },
        methods: {
            // 获取好友动态
            getMyFriendPyqNews() {
                const userId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                this.userId = userId;
                api.pyqNews.getMyFriendPyqNews(userId).then((res) => {
                    // console.log(res);
                    if (res.status == 200) {
                        // 朋友圈列表
                        this.pyqList = res.data.pyqList;
                        for (const item of this.pyqList) {
                            // 转换时间
                            // var date = new Date(item.createDate * 1000);
                            // const formattedDateString = this.formatTime(date);
                            // item.createDate = formattedDateString;
                            if (!this.comment[item.id]) {
                                this.comment[item.id] = '';
                            }
                        }
                        this.pyqList.sort(
                            (a, b) => Date.parse(b.createDate) - Date.parse(a.createDate)
                        );

                        // 更新数据到组件的data属性中
                        // this.pyqList = pyqList;
                        // console.log('pyqList', this.pyqList);

                        // 朋友圈点赞列表
                        this.pyqLikeList = res.data.pyqLikeList;
                        this.myLiked = [];
                        this.pyqIdList = {};
                        for (const item of this.pyqLikeList) {
                            // 转换时间
                            var date = new Date(item.createDate * 1000);
                            const formattedDateString = this.formatTime(date);
                            item.createDate = formattedDateString;
                            // 自己点过赞的放myLiked数组里
                            if (item.authorId == userId) {
                                this.myLiked.push(item.pyqId);
                            }
                            // 别人点赞的
                            this.pyqIdList[item.pyqId] = [];
                            // console.log(this.pyqIdList);
                            for (const key of this.pyqLikeList) {
                                if (key.pyqId == item.pyqId) {
                                    // console.log('key', key);
                                    this.pyqIdList[item.pyqId].push(key.authorName);
                                }
                            }
                        }
                        /**
                         * {6543618b80de6e3e74176q1a: Array(1), 6543618b80de6e3e7417611b: Array(1), 6543618b80de6e3e7417611a: Array(2), __ob__: Observer}
                         * 6543618b80de6e3e74176q1a: ['fyt']
                         * 6543618b80de6e3e7417611a: (2) ['fyt', 'ymq']
                         * 6543618b80de6e3e7417611b: ['fyt']
                         */
                        // console.log('this.pyqIdList', this.pyqIdList);
                        // console.log(this.pyqLikeList);

                        // 朋友圈评论列表
                        this.pyqCommentList = res.data.pyqCommentList;
                        // for (const item of this.pyqCommentList) {
                        // 转换时间
                        // var date = new Date(item.createDate * 1000);
                        // const formattedDateString = this.formatTime(date);
                        // item.createDate = formattedDateString;
                        // console.log(item.replyToAuthorInfo);
                        // }
                        // console.log('pyqCommentList', this.pyqCommentList);
                        // console.log(this.comment);
                    }
                });
            },

            // 转换时间
            formatTime(date) {
                const inputDate = new Date(date);
                const year = inputDate.getFullYear();
                const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
                const day = String(inputDate.getDate()).padStart(2, '0');
                const hours = String(inputDate.getHours()).padStart(2, '0');
                const minutes = String(inputDate.getMinutes()).padStart(2, '0');
                const formattedDateString = `${year}年${month}月${day}日 ${hours}:${minutes}`;
                // console.log(formattedDateString);
                return formattedDateString;
            },

            // 点赞
            // 用防抖
            doLike(pyqId, index) {
                // 被点赞的朋友圈
                // console.log(pyqId);
                // console.log(index);

                const params = {
                    pyqId: pyqId,
                    authorId: this.userId
                };

                api.pyqLike.doLike(params).then((res) => {
                    // console.log(res);
                    if (res.status == 1003) {
                        Message({
                            message: '已经点过赞了',
                            type: 'warning'
                        });
                    }
                    if (res.status == 200) {
                        this.myLiked.push(pyqId);
                        // console.log(this.myLiked);
                        this.getMyFriendPyqNews();
                    }
                });
            },
            // 聚焦到评论框
            focusComment(pyqId, pyqIndex) {
                // this.replyComment = {};
                // this.comment[pyqId] = '';
                this.$forceUpdate();
                this.$nextTick(() => {
                    this.$refs.inputRef[pyqIndex].focus();
                });
                // console.log('replyComment', this.replyComment);
            },
            onFocus(pyqId) {
                this.replyComment = {};
                this.comment[pyqId] = '';
                // console.log('onFocusReplyComment', this.replyComment);
                // console.log('onFocusComment', this.comment);
            },
            // 添加评论
            addComment(id) {
                // console.log(this.comment);
                if (this.comment[id].trim() !== '') {
                    // 检查输入框是否为空
                    const params = {
                        pyqId: id,
                        content: this.comment[id],
                        authorId: this.userId,
                        ...this.replyComment,
                        replyToAuthorInfo: this.replyComment.replyToAuthorInfo
                    };

                    api.pyqComments.addComment(params).then((res) => {
                        // console.log(res);
                        if (res.status == 200) {
                            this.getMyFriendPyqNews();
                            Message({
                                message: '评论发表成功',
                                type: 'success'
                            });
                        }
                    });

                    // console.log('params', params);
                } else {
                    Message({
                        message: '输入内容不能为空',
                        type: 'warning'
                    });
                }
            },

            reply(pyqId, level, parentId, replyToAuthorInfo, pyqIndex) {
                // this.replyComment = {};
                // console.log('pyqId', pyqId);
                // console.log('level', level);
                // console.log(parentId);
                // console.log(replyToAuthorInfo);
                // console.log(pyqIndex);

                this.$refs.inputRef[pyqIndex].focus();
                // this.comment[pyqId] = '';
                // console.log('replyComment1', this.replyComment);

                // 在这里进行其他操作，例如将被回复者的信息显示到输入框中
                if (replyToAuthorInfo) {
                    this.preText[pyqId] = `回复 ${replyToAuthorInfo['authorName']} : `;

                    // console.log('preText', this.preText[pyqId]);
                    // 在增删改数据后实行强制更新
                    this.$forceUpdate();
                }

                // 子评论的评论
                if (level == 2) {
                    // 新的评论内容
                    this.replyComment = {
                        // pyqId: pyqId,
                        level: level,
                        parentId: parentId,
                        replyToAuthorInfo: replyToAuthorInfo
                    };
                    // 子评论
                } else if (level == 1) {
                    // 新的评论内容
                    this.replyComment = {
                        // pyqId: pyqId,
                        level: level,
                        parentId: parentId
                    };
                }
                // console.log('replyComment2', this.replyComment);
            },
            // 失焦时删除preText的内容 '回复 xxx:'
            onBlur(pyqId) {
                // console.log('blur');
                // console.log(pyqId);
                this.preText[pyqId] = '';
                setTimeout(() => {
                    this.comment[pyqId] = '';
                    this.$forceUpdate();
                }, 1000);
                // console.log(this.preText);
                this.$forceUpdate();
            }
        },
        watch: {},
        mounted() {
            this.getMyFriendPyqNews();
        }
    };
</script>
<style lang="scss" scoped>
    @import '../../../static/iconfont/iconfont.css';
    .friendMzone {
        /* height: 100%; */
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .addNewStory {
            width: 92%;
            margin: 0.625rem 0 1.25rem 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
        .pyqContent-transition {
            width: 85%;
        }
        .slide-enter-active {
            transition: transform 0.5s ease;
        }
        .slide-enter {
            transform: translateX(100%);
        }

        .pyqContent {
            width: 100%;
            margin: 0.625rem 0 1.875rem 0;

            .userInfo {
                display: flex;
                flex-direction: row;
                padding-bottom: 0.625rem;
                border-bottom: 0.0625rem solid #dbdcdd;
                img {
                    width: 3.75rem;
                    height: 3.75rem;
                    border-radius: 50%;
                    float: left;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    height: 3.75rem;
                    justify-content: center;
                    align-items: flex-start;
                    .name {
                        margin-left: 1.25rem;
                        font-size: 1rem;
                        font-weight: 600;
                        /* font-family: ; */
                    }
                    .createTime {
                        font-size: 0.875rem;
                        padding: 0.5rem 0 0 1.25rem;
                        color: #909399;
                    }
                }
            }

            .main {
                /* background-color: red; */
                margin: 0.625rem 0 0 0;
                padding: 0.625rem 0;

                .content {
                    /* background-color: yellow; */
                    text-align: left;
                    margin: 0 1.25rem;
                    padding: 0.3125rem;
                }
                .footer {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 0.9375rem;
                    padding: 0 0 0.5rem 0.3125rem;
                    border-bottom: 0.0625rem solid #dbdcdd;
                    .readCount {
                        color: #bdbdbf;
                        font-size: 0.875rem;
                        letter-spacing: 0.0625rem;
                        text-align: left;
                    }

                    .operation {
                        margin-right: 1.25rem;
                        .iconfont {
                            font-size: 1.375rem;
                            margin: 0 0.9375rem;
                            transition: all 0.2s ease;
                        }
                        .iconfont:hover {
                            cursor: pointer;
                            color: #605bff;
                        }
                    }
                }
            }

            .likeList {
                float: left;
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 100%;

                margin: 0.3125rem 0 0.9375rem 0;
                i {
                    font-size: 1.25rem;
                    color: #605bff;
                }
                .list {
                    display: flex;
                    flex-direction: row;
                    span {
                        cursor: pointer;
                        padding: 0 0.625rem;
                    }
                }
            }

            .commentList {
                margin-top: 0.3125rem;
                width: 100%;
                display: flex;
                flex-direction: column;

                /* margin: 8px 0; */

                img {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    margin: 0.625rem;
                }

                .zero,
                .first,
                .second {
                    display: flex;
                    flex-direction: row;
                    margin: 0.3125rem 0;
                    .friendInfo {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        > span {
                            margin-bottom: 0.0625rem;
                        }
                        .footer {
                            display: flex;
                            flex-direction: row;
                            font-size: 0.75rem;
                            .date {
                                color: #bdbdbf;
                            }
                            .reply {
                                color: #605bff;
                                margin-left: 0.9375rem;
                                cursor: pointer;
                            }
                        }
                    }
                }
                .first,
                .second {
                    margin-left: 2.5rem;
                }

                .addComment {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    align-items: center;
                    margin-top: 0.625rem;
                    i {
                        font-size: 0.75rem;
                    }
                    input {
                        min-width: 75%;
                        max-width: 85%;
                        width: 82%;
                        min-height: 2.5rem;
                        border-radius: 0.25rem;
                        border: 0.0625rem solid #dbdcdd;
                        padding-left: 0.625rem;
                    }
                    input:focus-visible {
                        outline: 0.0625rem solid #605bff;
                    }
                    .iconfont {
                        font-size: 1.75rem;
                        cursor: pointer;
                    }
                    button {
                        /* margin: 0 10px; */
                        width: 3.75rem;
                        background-color: #605bff;
                        border-radius: 0.25rem;
                        height: 1.875rem;
                        color: #fff;
                        border: none;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
