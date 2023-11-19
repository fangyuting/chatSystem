<template>
    <div class="myMzone">
        <transition-group name="slide" mode="out-in" class="myMzoneContent-transition">
            <div class="myMzoneContent" v-for="(item, mzoneIndex) in myMzoneList" :key="mzoneIndex">
                <!-- 朋友圈好友信息 -->
                <div class="userInfo">
                    <img src="../../../static/image/touxiang.jpg" alt="" />
                    <div class="info">
                        <span class="name">{{ item.userName }}</span>
                        <span class="createTime">{{ item.createDate }}</span>
                    </div>
                    <div class="delete">
                        <span @click="deleteMzone(item.id)">删除</span>
                    </div>
                </div>
                <div class="main">
                    <div class="content">
                        {{ item.content }}
                    </div>
                    <div class="footer">
                        <div class="readCount"></div>
                        <div class="operation">
                            <span
                                class="icon-icon iconfont"
                                @click="doLike(item.id, mzoneIndex)"
                                :style="myLiked.includes(item.id) ? 'color:#605bff' : ''"
                            ></span>
                            <span
                                class="icon-pinglun iconfont"
                                @click="focusComment(item.id, mzoneIndex)"
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
                        v-for="(comment, commentIndex) in myMzoneCommentList"
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
                                                    mzoneIndex
                                                )
                                            "
                                        >
                                            回复
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-for="(commentlevel1, index) in myMzoneCommentList"
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
                                                    mzoneIndex
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
                                v-for="(commentlevel2, index) in myMzoneCommentList"
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
                                                    mzoneIndex
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
    export default {
        name: 'myMzone',
        data() {
            return {
                userId: '',
                myMzoneList: [],
                comment: {},
                myMzoneCommentList: [],
                myMzoneLikeList: [],
                myLiked: [],
                pyqIdList: {},
                preText: {},
                replyComment: {}
            };
        },
        created() {
            this.getMyMzone();
        },
        mounted() {},
        methods: {
            getMyMzone() {
                const userId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                this.userId = userId;
                api.pyqNews.getMyMzone(userId).then((res) => {
                    // console.log(res);
                    if (res.status == 200) {
                        this.myMzoneList = res.data.myMzone;
                        for (const item of this.myMzoneList) {
                            if (!this.comment[item.id]) {
                                this.comment[item.id] = '';
                            }
                        }
                        this.myMzoneList.sort(
                            (a, b) => Date.parse(b.createDate) - Date.parse(a.createDate)
                        );

                        // 朋友圈点赞列表
                        this.myMzoneLikeList = res.data.myMzoneLikeList;
                        this.myLiked = [];
                        this.pyqIdList = {};
                        for (const item of this.myMzoneLikeList) {
                            // 自己点过赞的放myLiked数组里
                            if (item.authorId == userId) {
                                this.myLiked.push(item.pyqId);
                            }
                            // 别人点赞的
                            this.pyqIdList[item.pyqId] = [];
                            // console.log(this.pyqIdList);
                            for (const key of this.myMzoneLikeList) {
                                if (key.pyqId == item.pyqId) {
                                    // console.log('key', key);
                                    this.pyqIdList[item.pyqId].push(key.authorName);
                                }
                            }
                        }
                        // 朋友圈评论列表
                        this.myMzoneCommentList = res.data.myMzoneCommentList;
                        // console.log('myMzoneCommentList', this.myMzoneCommentList);
                    }
                });
            },

            deleteMzone(id) {
                // console.log(id);
                this.$confirm('是否要删除该条动态', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        const params = {
                            pyqId: id
                        };
                        api.pyqNews.deleteMyMzone(params).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getMyMzone();
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: '删除失败!'
                                });
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },

            // 点赞
            // 用防抖
            doLike(pyqId, mzoneIndex) {
                // 被点赞的朋友圈
                // console.log(pyqId);
                // console.log(mzoneIndex);

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
                        this.getMyMzone();
                    }
                });
            },
            // 聚焦到评论框
            focusComment(pyqId, mzoneIndex) {
                // this.replyComment = {};
                // this.comment[pyqId] = '';
                this.$forceUpdate();
                this.$nextTick(() => {
                    this.$refs.inputRef[mzoneIndex].focus();
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
                            this.getMyMzone();
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
        }
    };
</script>
<style lang="scss" scoped>
    .myMzone {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .slide-enter-active {
            transition: transform 0.5s ease;
        }
        .slide-enter {
            transform: translateX(100%);
        }
        .myMzoneContent-transition {
            width: 85%;
            .myMzoneContent {
                width: 100%;
                margin: 10px 0 30px 0;
                .userInfo {
                    /* width: 100%; */
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #dbdcdd;
                    img {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        float: left;
                    }
                    .info {
                        display: flex;
                        flex-direction: column;
                        height: 60px;
                        justify-content: center;
                        align-items: flex-start;
                        .name {
                            margin-left: 20px;
                            font-size: 16px;
                            font-weight: 600;
                        }
                        .createTime {
                            font-size: 14px;
                            padding: 8px 0 0 20px;
                            color: #909399;
                        }
                    }

                    .delete {
                        flex: 1;
                        text-align: right;
                        cursor: pointer;
                        padding: 2px;
                        margin-right: 20px;
                    }
                    .delete:hover {
                        color: #605bff;
                    }
                }
                .main {
                    margin: 10px 0 0px 0;
                    padding: 10px 0;

                    .content {
                        text-align: left;
                        margin: 0 20px;
                        padding: 5px;
                    }
                    .footer {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 15px;
                        padding: 0px 0px 8px 5px;
                        border-bottom: 1px solid #dbdcdd;
                        .readCount {
                            color: #bdbdbf;
                            font-size: 14px;
                            letter-spacing: 1px;
                            text-align: left;
                        }

                        .operation {
                            margin-right: 20px;
                            .iconfont {
                                font-size: 22px;
                                margin: 0 15px;
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

                    margin: 5px 0 15px 0px;
                    i {
                        font-size: 20px;
                        color: #605bff;
                    }
                    .list {
                        display: flex;
                        flex-direction: row;
                        span {
                            cursor: pointer;
                            padding: 0 10px;
                        }
                    }
                }

                .commentList {
                    margin-top: 5px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;

                    /* margin: 8px 0; */

                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        margin: 10px;
                    }

                    .zero,
                    .first,
                    .second {
                        display: flex;
                        flex-direction: row;
                        margin: 5px 0;
                        .friendInfo {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-start;
                            > span {
                                margin-bottom: 1px;
                            }
                            .footer {
                                display: flex;
                                flex-direction: row;
                                font-size: 12px;
                                .date {
                                    color: #bdbdbf;
                                }
                                .reply {
                                    color: #605bff;
                                    margin-left: 15px;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                    .first,
                    .second {
                        margin-left: 40px;
                    }

                    .addComment {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        flex-wrap: nowrap;
                        align-items: center;
                        margin-top: 10px;
                        i {
                            font-size: 12px;
                        }
                        input {
                            min-width: 75%;
                            max-width: 85%;
                            width: 82%;
                            min-height: 40px;
                            border-radius: 4px;
                            border: 1px solid #dbdcdd;
                            padding-left: 10px;
                        }
                        input:focus-visible {
                            outline: 1px solid #605bff;
                        }
                        .iconfont {
                            font-size: 28px;
                            cursor: pointer;
                        }
                        button {
                            /* margin: 0 10px; */
                            width: 60px;
                            background-color: #605bff;
                            border-radius: 4px;
                            height: 30px;
                            color: #fff;
                            border: none;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
</style>
