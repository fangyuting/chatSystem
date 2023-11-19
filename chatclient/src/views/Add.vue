<template>
    <div class="add">
        <!-- 搜索栏 -->
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
            <el-input type="text" class="search-input" v-model="searchContent"></el-input>
            <i class="el-icon-search el-input__icon search-icon" @click="fetch"></i>
        </div>
        <div class="user-list">
            <!-- searchContent没有内容 && 没有验证申请 -->
            <div v-if="searchContent == '' && validateNewsResults == ''" class="noneList">
                <img src="../../static/image/add2.png" alt="" class="noContent" />
                <span>暂无搜索内容~</span>
            </div>
            <!-- searchContent没有内容 && 有验证申请  -->
            <div
                class="validateNewsList"
                v-else-if="searchContent == '' && validateNewsResults !== ''"
                v-loading="isAdding"
            >
                <validateNews @refreshValidateNews="fetchMyValidateNews"></validateNews>
            </div>
            <!-- searchContent有内容 -->
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
                    <div v-for="item in searchGroupResults" :key="item.id" class="searchItem">
                        <el-form class="searchForm">
                            <div class="item-left">
                                <img src="../../static/image/touxiang.jpg" alt="" />
                            </div>
                            <div class="item-right">
                                <span>Code: {{ item.code }}</span>
                                <span>群名称: {{ item.title }}</span>
                                <span>{{ item.desc }}</span>

                                <button class="search-btn" @click="showAdditionDialog(item.id)">
                                    Add Group
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
    import validateNews from '../components/add/validateNews';
    export default {
        name: 'Add',
        components: {
            validateNews
        },
        sockets: {
            connect() {
                console.log('Socket 连接成功');
                // this.OnImageSocket();
            },
            sendValidateMessage(val) {
                console.log('sendValidateMessageSuccess :>>', val);
            },
            sendAgreeFriendValidate(data) {
                console.log('sendAgreeFriendValidate :>>', data);
            },
            sendAgreeGroupValidate(data) {
                console.log('sendAgreeGroupValidate :>>', data);
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
                        { id: 2, label: '用户账号', value: 'name' },
                        { id: 3, label: '昵称', value: 'nickname' }
                    ],
                    group: [
                        { id: 1, label: 'Chat账号', value: 'code' },
                        { id: 2, label: '名称', value: 'groupName' }
                    ]
                },
                flag: '',
                searchResults: [],
                searchGroupResults: [],
                pageSize: 5,
                pagenum: 1,
                total: 0,

                additionDialog: false, // 附加信息框
                additionText: '', // 附加消息
                reveiverId: '',
                validateNewsResults: [], // 新的申请信息

                isAdding: false
            };
        },

        computed: {
            searchType() {
                return this.searchedObject == 'User'
                    ? this.searchTypes['friend']
                    : this.searchTypes['group'];
            }
        },
        created() {
            this.fetchMyValidateNews();
        },
        watch: {
            // 监听searchContent变化
            searchContent: {
                handler(newVal) {
                    if (newVal === '') {
                        // 如果searchContent为空，清空user-list相关数据
                        this.searchResults = [];
                        this.searchGroupResults = [];
                        this.total = 0;
                        this.pagenum = 1;
                    }
                },
                immediate: true // 立即触发，确保在初始值为空时也能清空user-list
            }
        },
        methods: {
            // 搜索
            fetch() {
                // 先清空上次查找的记录
                this.searchResults = [];
                this.searchGroupResults = [];
                this.total = 0;
                this.pagenum = 1;
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
                    console.log('res', res);
                    // console.log(res.data);

                    if (res.status == 200) {
                        this.flag = '0';
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
                const params = {
                    optionType: option,
                    value: this.searchContent,
                    pageSize: this.pageSize,
                    pagenum: this.pagenum
                };
                console.log(params);
                api.group.preFetchGroup(params).then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        this.flag = '1';
                        this.searchGroupResults = res.data.rows.map((item) => item);
                        this.total = res.pagination.total;
                        console.log(this.total);
                        console.log(this.searchGroupResults);
                    }
                });
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
                this.reveiverId = item;
                console.log('reveiverId', this.reveiverId);
                this.additionDialog = !this.additionDialog;
            },

            // 取消发送申请
            cancelApply() {
                this.additionText = '';
                this.additionDialog = false;
            },

            // 发送添加申请
            sendApply() {
                console.log(this.searchedObject);
                this.additionDialog = false;
                // 发送者id 发送者昵称 发送者头像
                // 接收者id 群聊id
                const senderId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                const senderNickname = JSON.parse(window.localStorage.getItem('userInfo')).nickname;
                const senderName = JSON.parse(window.localStorage.getItem('userInfo')).name;
                const senderAvatar = JSON.parse(window.localStorage.getItem('userInfo')).photo;
                const reveiverId = this.reveiverId;

                if (this.searchedObject == 'User') {
                    console.log('User');
                    console.log(reveiverId);
                    const val = {
                        senderId: senderId,
                        senderNickname: senderNickname,
                        senderName: senderName,
                        senderAvatar: senderAvatar,
                        reveiverId: reveiverId,
                        additionMessage: this.additionText,
                        validateType: 0
                    };
                    console.log(val);
                    this.$socket.emit('sendValidateMessage', val);
                } else {
                    console.log('group');
                    const val = {
                        senderId: senderId,
                        senderNickname: senderNickname,
                        senderName: senderName,
                        senderAvatar: senderAvatar,
                        groupId: reveiverId,
                        additionMessage: this.additionText,
                        validateType: 1
                    };
                    console.log(val);
                    this.$socket.emit('sendValidateMessage', val);
                }
            },

            // 获取好友申请列表
            async fetchMyValidateNews() {
                const params = {
                    reveiverId: JSON.parse(window.localStorage.getItem('userInfo')).id
                };
                console.log('reveiverId', params);
                api.validateNews.getMyValidateNews(params).then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        this.groupName = res.groupName;

                        const validateNewsGroupResults = res.data.resultArray.map((item) => item);
                        const validateNewsUserResults = res.data.validateNewsUserList.map(
                            (item) => item
                        );
                        this.validateNewsResults =
                            validateNewsGroupResults.concat(validateNewsUserResults);
                        this.$store.dispatch(
                            'add/SET_VALIDATE_NEWS_RESULTS',
                            this.validateNewsResults
                        );

                        console.log(this.validateNewsResults);
                        console.log('validateNewsUserResults', validateNewsUserResults);
                        console.log('validateNewsGroupResults', validateNewsGroupResults);
                    }
                });
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
            margin: 0.625rem;
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
            height: 85%;
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
            .validateNewsList {
                width: 100%;
                /* height: 100%; */
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                overflow-y: auto;
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
                        width: 21.875rem;
                        height: 12.5rem;
                        border-radius: 0.625rem;
                        box-shadow: 0 0 1.875rem #e6e6e6;
                        display: inline-block;
                        margin: 2.5rem 0;
                        .item-left {
                            float: left;
                            margin: 1.25rem;
                            img {
                                width: 4.0625rem;
                                height: 4.0625rem;
                                border-radius: 50%;
                            }
                        }
                        .item-right {
                            padding: 1.6875rem 0 0 0.3125rem;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            position: relative;
                            height: 100%;
                            span {
                                line-height: 1.625rem;
                                font-weight: 800;
                            }
                            .signature {
                                width: 9.375rem;
                                margin: 0.3125rem 0 0 0.5rem;
                                font-size: 0.75rem;
                                font-weight: 400;
                                color: gray;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                text-align: left;
                            }
                            .search-btn {
                                width: 6.25rem;
                                height: 2.1875rem;
                                border-radius: 0.375rem;
                                background-color: #b42db4;
                                color: #fff;
                                border: none;
                                position: absolute;
                                bottom: 1.25rem;
                                right: 1.25rem;
                                cursor: pointer;
                            }
                            .btn {
                                display: flex;
                                flex-direction: row;
                                width: 100%;
                                margin-top: 2.5rem;
                                margin-left: 1.25rem;
                                .agree-btn {
                                    width: 5rem;
                                    height: 2.1875rem;
                                    background-color: #66b1ff;
                                    border-radius: 0.375rem;
                                    color: #fff;
                                    border: none;
                                    cursor: pointer;
                                    margin-right: 0.625rem;
                                }
                                .reject-btn {
                                    width: 5rem;
                                    height: 2.1875rem;
                                    background-color: #f56c6c;
                                    border-radius: 0.375rem;
                                    color: #fff;
                                    border: none;
                                    cursor: pointer;
                                    margin-left: 0.625rem;
                                }
                            }
                        }
                    }

                    .header {
                        border-bottom: 0.125rem solid #ebe9e9;
                        padding: 0.9375rem;
                    }
                }
                .pagination {
                    position: fixed;
                    bottom: 1.25rem;
                    width: 100%;
                }
            }
        }
    }
</style>
