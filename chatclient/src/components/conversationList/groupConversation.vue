<template>
    <div class="groupConversation">
        <el-collapse according>
            <el-collapse-item class="topItem">
                <template slot="title">
                    <span>我创建的群聊 ({{ myHoldGroupList.length }})</span>
                </template>
                <div v-for="item in myHoldGroupList" :key="item.id" class="holdGroupList">
                    <img src="../../../static/image/touxiang.jpg" alt="" />
                    <div class="groupItem">
                        <span>{{ item.title }}</span>
                        <span class="desc">{{ item.desc }}</span>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <template slot="title">
                    <span>我管理的群聊 ({{ myManageGroupList.length }})</span>
                </template>
                <div v-for="item in myManageGroupList" :key="item.id" class="manageGroupList">
                    <img src="../../../static/image/touxiang.jpg" alt="" />
                    <div class="groupItem">
                        <span>{{ item.title }}</span>
                        <span class="desc">{{ item.desc }}</span>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <template slot="title">
                    <span>我加入的群聊 ({{ myGroupList.length }})</span>
                </template>
                <div v-for="item in myGroupList" :key="item.id" class="groupList">
                    <img src="../../../static/image/touxiang.jpg" alt="" />
                    <div class="groupItem">
                        <span>{{ item.title }}</span>
                        <span class="desc">{{ item.desc }}</span>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>

        <div class="addGroup">
            <i
                title="创建群聊"
                class="el-icon-circle-plus box-shadow1 circle"
                @click="createGroup"
            />
        </div>

        <transition-group name="slide" mode="out-in" class="addGroupDialog-transition">
            <el-dialog
                title="创建群聊"
                v-if="addGroupVisible"
                :visible.sync="addGroupVisible"
                width="30%"
                class="addGroupDialog"
                :key="addGroupVisible.toString()"
            >
                <el-form label-position="top" label-width="80px" :model="newGroup">
                    <el-form-item label="群头像  (点击头像可切换)" class="avatar">
                        <img src="../../../static/image/touxiang.jpg" alt="" />
                    </el-form-item>
                    <el-form-item label="群名称">
                        <el-input v-model="newGroup.groupName"></el-input>
                    </el-form-item>
                    <el-form-item label="群描述">
                        <el-input v-model="newGroup.groupDesc"></el-input>
                    </el-form-item>
                </el-form>

                <div class="btn">
                    <button @click="submit" class="submit">提交</button>
                    <button @click="reset" class="reset">重置</button>
                </div>
            </el-dialog>
        </transition-group>
    </div>
</template>

<script>
    import api from '../../api';
    import { Message } from 'element-ui';

    export default {
        name: 'groupConversation',
        data() {
            return {
                addGroupVisible: false,
                newGroup: {
                    avatar: '',
                    groupName: '',
                    groupDesc: ''
                },

                myGroupList: [],
                myHoldGroupList: [],
                myManageGroupList: []
            };
        },
        created() {
            this.getMyGroup();
        },
        methods: {
            getMyGroup() {
                const userId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                this.myGroupList = [];
                this.myHoldGroupList = [];
                this.myManageGroupList = [];
                api.group.getMyGroup(userId).then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        const existingGroup = res.data.existingGroup;
                        existingGroup.forEach((item) => {
                            // console.log(item);
                            this.myGroupList.push({
                                groupId: item.groupId,
                                holder: item.holder,
                                manager: item.manager
                            });
                        });
                        // const existingGroup = res.data.existingGroup;
                        const groupList = res.data.groupList;
                        // existingGroup.forEach((item) => {
                        //     // console.log(item);
                        //     this.myGroupList.push({
                        //         groupId: item.groupId,
                        //         holder: item.holder,
                        //         manager: item.manager
                        //     });
                        // });
                        groupList.forEach((item) => {
                            for (const group of this.myGroupList) {
                                // console.log(item);
                                if (group.groupId == item.groupId) {
                                    // console.log(item);
                                    // console.log(group);
                                    for (const key in item) {
                                        group[key] = item[key];
                                    }
                                }
                            }
                        });
                        console.log('this.myGroupList', this.myGroupList);

                        this.getMyHoldGroupList();
                        this.getMyManageGroupList();
                    }
                });
            },
            createGroup() {
                this.addGroupVisible = true;
            },

            submit() {
                const userId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                const userName = JSON.parse(window.localStorage.getItem('userInfo')).name;
                const params = {
                    ...this.newGroup,
                    userId: userId,
                    userName: userName
                };

                api.group.addNewGroup(params).then((res) => {
                    console.log(res);
                    if (res.status === 1003) {
                        Message({
                            message: '该群名已被注册',
                            type: 'warning'
                        });
                        this.addGroupVisible = false;
                    }
                    if (res.status === 200) {
                        Message({
                            message: '注册成功',
                            type: 'success'
                        });
                        this.addGroupVisible = false;
                        this.getMyGroup();
                    }
                });
            },
            reset() {
                this.newGroup = {};
            },
            // 我创建的群聊
            getMyHoldGroupList() {
                for (const item of this.myGroupList) {
                    if (item.holder == 1) {
                        this.myHoldGroupList.push(item);
                    }
                }
                console.log(this.myHoldGroupList);
            },
            getMyManageGroupList() {
                for (const item of this.myGroupList) {
                    if (item.holder == 1) {
                        this.myManageGroupList.push(item);
                    }
                }
                console.log(this.myManageGroupList);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .groupConversation {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        /* position: relative; */
        .el-collapse {
            border: none;
            flex: 1;
            /deep/ .el-collapse-item__wrap {
                border-bottom: none;
            }
        }
        .holdGroupList,
        .manageGroupList,
        .groupList {
            float: left;
            display: flex;
            align-items: center;
            width: 100%;
            height: 65px;
            border-bottom: 2px solid #f8f8f8;
            transition: all 0.3s ease;
            font-size: 16px;
            img {
                width: 2.8125rem;
                height: 2.8125rem;
                border-radius: 50%;
            }
            .groupItem {
                margin-left: 0.625rem;
                /* height: 4.0625rem; */
                font-family: monospace;
                text-align: left;
                display: flex;
                flex-direction: column;
                .desc {
                    font-size: 14px;
                    color: #9a9aa9;
                }
            }
        }
        .addGroup {
            position: absolute;
            right: 1.5625rem;
            bottom: 1.25rem;
            /* bottom: 14.375rem; */
            /* left: 220px; */
            font-size: 3.4375rem;
            color: #1aafff;
            cursor: pointer;
        }

        .addGroupDialog-transition {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            .slide-enter-active,
            .slide-leave-active {
                transition: transform 0.5s ease;
            }
            .slide-enter {
                transform: translateY(100%);
            }
            .slide-leave-to {
                transform: translateY(100%);
            }

            .addGroupDialog {
                float: left;
                /* border-radius: 10px; */
                /deep/ .el-dialog {
                    border-radius: 8px;
                    /* border: none; */
                }
                /deep/ .el-dialog__body {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                }

                .avatar {
                    img {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }
                }
                .btn {
                    float: left;
                    button {
                        border: none;
                        width: 60px;
                        height: 30px;
                        margin: 10px 10px 0 0;
                        border-radius: 3px;
                        cursor: pointer;
                    }

                    .submit {
                        background-color: #409eff;
                        color: #fff;
                    }
                    .reset {
                        border: 1px solid #dcdfe6;
                        background-color: #fff;
                    }
                }
            }
        }
    }

    /* 不显示滚动条也可以滚动 */
    .groupConversation::-webkit-scrollbar {
        display: none;
    }
</style>
