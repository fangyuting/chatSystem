<template>
    <div class="add">
        <div class="search">
            <!-- 搜索对象 人/群 -->
            <el-select v-model="searchedObject" placeholder="请选择" class="search-object">
                <el-option v-for="item in searchObjectMap" :key="item" :value="item"></el-option>
            </el-select>
            <!-- 搜索方式 code/账号/昵称 -->
            <el-select v-model="selectedOption" placeholder="请选择" class="search-option">
                <el-option
                    v-for="item in searchType"
                    :key="item.id"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-input type="text" class="search-input" v-model="searchContent">10000011</el-input>
            <i class="el-icon-search el-input__icon search-icon" @click="fetch"></i>
        </div>
        <div class="user-list">
            <div v-if="searchContent == ''" class="noneList">
                <img src="../../static/image/add2.png" alt="" class="noContent" />
                <span>暂无搜索内容~</span>
            </div>
            <div class="searchList" v-else>
                <transition-group name="slide" mode="out-in" class="search-transition">
                    <div v-for="item in searchResults" :key="item.id" class="searchItem">
                        <el-form class="searchForm">
                            <div class="item-left">
                                <img src="../../static/image/touxiang.jpg" alt="" />
                            </div>
                            <div class="item-right">
                                <span>Code: {{ item.code }}</span>
                                <span>account: {{ item.name }}</span>
                                <span>{{ item.nickname }}</span>
                                <span
                                    class="signature"
                                    :title="item.signature"
                                    v-if="item.signature !== ''"
                                >
                                    个性签名:{{ item.signature }}
                                </span>
                                <button class="search-btn" @click="showAdditionDialog(item.id)">
                                    Add User
                                </button>
                            </div>
                        </el-form>
                    </div>
                </transition-group>

                <!-- 分页栏 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    :current-page="pagenum"
                    class="pagination"
                    v-if="searchContent !== ''"
                ></el-pagination>
            </div>
        </div>

        <div class="dialog" v-if="additionDialog">
            <el-dialog title="附加消息" :visible.sync="additionDialog">
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="additionText"
                    width="60%"
                ></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelApply">取 消</el-button>
                    <el-button type="primary" @click="sendApply">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import api from '../api';
    export default {
        name: 'Add',
        sockets: {
            disconnect() {
                alert('Socket 断开');
            },

            connect() {
                console.log('Socket 连接成功');
                // this.OnImageSocket();
            },
            sendValidateMessage(val) {
                console.log('sendValidateMessageSuccess :>>', val);
            }
        },
        data() {
            return {
                searchedObject: 'User', // 搜索对象 人/群
                selectedOption: 'code', // 搜索方式 code/账号/昵称
                searchContent: '',
                searchObjectMap: ['User', 'Group'],
                searchTypes: {
                    friend: [
                        { id: 1, label: 'Chat账号', value: 'code' },
                        { id: 2, label: '用户账号', value: 'userName' },
                        { id: 3, label: '昵称', value: 'nickname' }
                    ],
                    group: [
                        { id: 1, label: 'Chat账号', value: 'code' },
                        { id: 2, label: '名称', value: 'groupName' }
                    ]
                },
                searchResults: [],
                pageSize: 5,
                pagenum: 1,
                total: 0,

                additionDialog: false, // 附加信息框
                additionText: '', // 附加消息
                reveiverId: ''
            };
        },

        computed: {
            searchType() {
                return this.searchedObject == 'User'
                    ? this.searchTypes['friend']
                    : this.searchTypes['group'];
            }
        },
        mounted() {},
        methods: {
            // 搜索
            fetch() {
                // console.log('searchedObject', this.searchedObject);
                // console.log('selectedOption', this.selectedOption);
                this.pagenum = 1;
                if (this.searchedObject == 'User') {
                    this.fetchUser(this.selectedOption);
                } else {
                    this.fetchGroup(this.selectedOption);
                }
            },
            // 搜索用户
            fetchUser(option) {
                console.log(option);
                const params = {
                    optionType: option,
                    value: this.searchContent,
                    pageSize: this.pageSize,
                    pagenum: this.pagenum
                };
                console.log(params);
                api.user.preFetchUser(params).then((res) => {
                    console.log(res);
                    // console.log(res.data);

                    if (res.status == 200) {
                        this.searchResults = res.data.rows.map((item) => item);
                        this.total = res.pagination.total;
                        console.log(this.total);
                        console.log(this.searchResults);
                    }
                });
            },
            // 搜索群组
            fetchGroup(option) {
                console.log(option);
            },
            // 监听 pageSize 改变的事件
            handleSizeChange(newSize) {
                console.log(newSize);
                this.pageSize = newSize;
                if (this.searchedObject == 'User') {
                    this.fetchUser(this.selectedOption);
                }
            },
            // 监听 pagenum 改变的事件
            handleCurrentChange(newPage) {
                console.log(newPage);
                this.pagenum = newPage;
                if (this.searchedObject == 'User') {
                    this.fetchUser(this.selectedOption);
                }
            },
            // 附加信息框
            showAdditionDialog(item) {
                console.log(item);
                this.reveiverId = item.id;
                this.additionDialog = !this.additionDialog;
            },

            // 取消发送申请
            cancelApply() {
                this.additionText = '';
                this.additionDialog = false;
            },

            // 发送添加申请
            sendApply() {
                this.additionDialog = false;
                // 发送者id 发送者昵称 发送者头像
                // 接收者id 群聊id
                const senderId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                const senderNickname = JSON.parse(window.localStorage.getItem('userInfo')).nickname;
                const senderName = JSON.parse(window.localStorage.getItem('userInfo')).name;
                const senderAvatar = JSON.parse(window.localStorage.getItem('userInfo')).photo;
                const receiverId = this.receiverId;
                const val = {
                    senderId: senderId,
                    senderNickname: senderNickname,
                    senderName: senderName,
                    senderAvatar: senderAvatar,
                    receiverId: receiverId
                };
                this.$socket.emit('sendValidateMessage', val);
                // api.validateNews.sendValidateMessage(params).then((res) => {
                //     console.log(res);
                // });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .add {
        width: 100%;
        height: 100vh;
        display: flex;
        background-color: #f8f8f8;
        flex-direction: column;

        .search {
            /* height: 10%; */
            /* background-color: red; */
            flex: 0.1;
            border-radius: 0.3125rem;
            margin: 10px;
            margin-bottom: 0.3125rem;
            display: flex;
            align-items: center;
            .search-object {
                flex: 0.08;
                margin-right: 0.9375rem;
            }
            .search-option {
                flex: 0.09;
                margin-right: 0.9375rem;
            }
            .search-input {
                flex: 0.5;
                margin-right: 1.25rem;
            }
            .search-icon {
                position: relative;
                left: -4.4375rem;
                cursor: pointer;
            }
            .el-input__icon {
                height: 3.125rem;
                width: 3.125rem;
                line-height: 3.125rem;
            }
            /deep/ .el-input__inner {
                height: 3.125rem;
            }
        }
        .user-list {
            height: 90%;
            background-color: #fff;
            margin: 0.625rem;
            border-radius: 0.5rem;
            box-shadow: 0 0 1.5625rem #dbdbdb;
            flex: 0.9;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .noneList {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .noContent {
                    width: 21.875rem;
                    /* height: 300px; */
                    line-height: 100%;
                }
                > span {
                    font-weight: bold;
                    font-size: 1.625rem;
                    margin-top: 1.875rem;
                    letter-spacing: 0.1875rem;
                    cursor: context-menu;
                }
            }
            .searchList {
                width: 100%;
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                .search-transition {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    .slide-enter-active {
                        transition: transform 0.5s ease;
                    }
                    .slide-enter {
                        transform: translateY(100%);
                    }
                }
                .searchItem {
                    width: 33.3%;

                    /* border: 1px solid #000; */
                    /* margin: 20px; */
                    .searchForm {
                        width: 350px;
                        height: 200px;
                        border-radius: 10px;
                        box-shadow: 0 0 30px #e6e6e6;
                        display: inline-block;
                        margin: 40px 0;
                        .item-left {
                            float: left;
                            margin: 20px;
                            img {
                                width: 65px;
                                height: 65px;
                                border-radius: 50%;
                            }
                        }
                        .item-right {
                            padding: 27px 0 0 5px;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            position: relative;
                            height: 100%;
                            span {
                                line-height: 26px;
                                font-weight: 800;
                            }
                            .signature {
                                width: 150px;
                                margin: 5px 0 0 8px;
                                font-size: 12px;
                                font-weight: 400;
                                color: gray;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                text-align: left;
                            }
                            .search-btn {
                                width: 100px;
                                height: 35px;
                                border-radius: 6px;
                                background-color: #b42db4;
                                color: #fff;
                                border: none;
                                position: absolute;
                                bottom: 20px;
                                right: 20px;
                                cursor: pointer;
                            }
                        }
                    }

                    .header {
                        border-bottom: 2px solid #ebe9e9;
                        padding: 15px;
                    }
                }
                .pagination {
                    position: fixed;
                    bottom: 20px;
                    width: 100%;
                }
            }
        }
    }
</style>
