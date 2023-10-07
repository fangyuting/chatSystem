<template>
    <div class="setting">
        <div class="header">
            <img src="" alt="" />
            <div class="info-list">
                <div class="info-item">
                    <span>MessageId:</span>
                    {{ userInfo.code }}
                </div>
                <div class="info-item">
                    <span>账号:</span>
                    {{ userInfo.name }}
                </div>
                <div class="info-item">
                    <span>注册时间:</span>
                    {{ userInfo.signUpTime }}
                </div>
                <div class="info-item">
                    <span>登录时间:</span>
                    {{ userInfo.lastLoginTime }}
                </div>
            </div>
        </div>

        <div class="body">
            <div class="nav-list">
                <span
                    :class="currentTab === 'setting' ? 'operation-text isactive' : 'operation-text'"
                    @click="setCurrentTab('setting')"
                >
                    个人资料
                </span>
                <span
                    :class="
                        currentTab === 'password' ? 'operation-text isactive' : 'operation-text'
                    "
                    @click="setCurrentTab('password')"
                >
                    密码设置
                </span>
            </div>
            <div class="editContent">
                <ul class="content" v-show="currentTab === 'setting'">
                    <li v-for="item in list" class="setting-item">
                        <!-- isModifying 对象的属性对应着 list 数组中的各个属性 -->
                        <span>{{ listZHMap[item] }}</span>
                        <template v-if="item == 'sex'">
                            <el-radio-group
                                v-model="userSetting[item]"
                                size="small"
                                :disabled="!isModifying[item]"
                            >
                                <el-radio-button label="0">男</el-radio-button>
                                <el-radio-button label="1">女</el-radio-button>
                                <el-radio-button label="3">保密</el-radio-button>
                            </el-radio-group>
                        </template>
                        <template v-else>
                            <input
                                type="text"
                                v-model="userSetting[item]"
                                :disabled="!isModifying[item]"
                            />
                        </template>
                        <div class="action">
                            <span
                                class="operation-text"
                                v-show="!isModifying[item]"
                                @click="setModify(item, true)"
                            >
                                修改
                            </span>
                            <div v-show="isModifying[item]">
                                <span class="operation-text-info" @click="setModify(item, false)">
                                    取消
                                </span>
                                <span class="operation-text-save" @click="saveModify(item)">
                                    保存
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
                <el-form
                    class="content"
                    v-show="currentTab === 'password'"
                    :model="pwdSetting"
                    :rules="rules"
                    ref="pwdSetting"
                >
                    <el-form-item
                        v-for="(value, key) in pwdMap"
                        :key="key"
                        :prop="key"
                        class="password-item"
                    >
                        <!-- key 键 value 值 -->
                        <span>{{ value }}</span>
                        <el-input
                            type="password"
                            v-model="pwdSetting[key]"
                            :placeholder="pwdPlaceholder[key]"
                        />
                    </el-form-item>
                    <div class="btn">
                        <el-button type="primary" class="check" @click="updateUserPwd()">
                            确认
                        </el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../api/index';
    import { Message } from 'element-ui';
    import { removeCookie } from '../utils/token';

    export default {
        name: 'setting',
        data() {
            // 一定要放上面 不然报错
            const validateRepassword = async (rule, value, callback) => {
                console.log(this.currentInfo);
                if (value === this.pwdSetting.newPwd) {
                    callback();
                } else {
                    callback(new Error('两次输入的密码不一致'));
                }
            };
            return {
                sex: '男',
                // userInfo: {},
                isModifying: {}, // 控制输入框状态
                userSetting: {},
                currentTab: 'setting',

                list: ['name', 'age', 'email', 'sex', 'signature'],
                listZHMap: {
                    name: '昵称',
                    age: '年龄',
                    email: 'Email',
                    sex: '性别',
                    signature: '个性签名'
                },
                pwdMap: {
                    oldPwd: '旧密码',
                    newPwd: '新密码',
                    reNewPwd: '确认新密码'
                },
                pwdPlaceholder: {
                    oldPwd: '请输入原始密码',
                    newPwd: '请输入新密码',
                    reNewPwd: '请确认新密码'
                },
                pwdSetting: {
                    oldPwd: '',
                    newPwd: '',
                    reNewPwd: ''
                },
                rules: {
                    oldPwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        {
                            min: 6,
                            message: '输入密码长度必须大于6位'
                        },
                        {
                            pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
                            message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
                            trigger: 'blur'
                        }
                    ],
                    newPwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        {
                            min: 6,
                            message: '输入密码长度必须大于6位'
                        },
                        {
                            pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
                            message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
                            trigger: 'blur'
                        }
                    ],
                    reNewPwd: [
                        { required: true, message: '请确认密码', trigger: 'blur' },
                        {
                            validator: validateRepassword,
                            message: '两次输入密码不一致',
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        computed: {
            userInfo() {
                return this.$store.state.user.userInfo;
            }
        },
        created() {
            // vuex里的
            const userInfo = this.$store.state.user.userInfo;
            this.setUserState(userInfo);
        },
        methods: {
            // ? ? ?
            // 初始化
            setUserState(userInfo) {
                // this.$set(this.data,key,value)
                for (const item of this.list) {
                    this.$set(this.userSetting, item, userInfo[item]);
                    this.$set(this.isModifying, item, false);
                }
                console.log(this.isModifying);
                console.log(this.userSetting);
            },

            // 获取用户信息
            // getUserInfo() {
            //     const UserId = this.userInfo.id;
            //     // console.log(UserId);
            //     // 傻逼！！！！！
            //     // const params = {
            //     //     UserId: UserId
            //     // };

            //     // console.log(params);
            //     console.log('userid', UserId);
            //     api.user.getUserInfo(UserId).then((res) => {
            //         console.log(res);
            //         // this.userInfo = res.data;
            //     });
            // },

            // 修改内容
            setModify(item, flag) {
                for (const item in this.isModifying) {
                    if (this.isModifying.hasOwnProperty(item)) {
                        this.isModifying[item] = false;
                    }
                }
                this.isModifying[item] = flag; // 修改选中输入框状态 修改/取消 保存 切换
                // console.log(item);
                // flag 为 false 时 取消/保存
                if (!flag) {
                    this.setUserState(this.userInfo);
                }
            },

            // 保存修改的内容
            saveModify(item) {
                // 一次只修改一个元素
                // 没修改的情况
                if (this.userInfo[item] == this.userSetting[item]) {
                    // 没修改 直接传 undefined
                    this.setModify(undefined, false);
                    return;
                }

                let params = {
                    field: item, // 修改的键
                    value: this.userSetting[item], // 修改后的值
                    userId: this.userInfo.id // 修改用户的id
                };

                api.user.updateUserInfo(params).then((res) => {
                    console.log(res);
                    console.log('1');
                    if (res.status == 1003) {
                        Message({
                            message: '该昵称已被注册,换个昵称吧~',
                            type: 'error'
                        });
                    }
                    // else if (res.status == 2001) {
                    //     Message({
                    //         message: res.msg,
                    //         type: 'error'
                    //     });
                    //     this.$store.dispatch('user/LOGOUT');
                    //     this.$router.replace('/chatLogin');
                    // }
                    // else if (res.status == 2006) {
                    //     Message({
                    //         message: res.msg,
                    //         type: 'error'
                    //     });
                    //     this.$store.dispatch('user/LOGOUT');
                    //     this.$router.replace('/chatLogin');
                    // }

                    if (res.status == 200) {
                        Message({
                            message: '修改成功',
                            type: 'success'
                        });

                        this.$store.dispatch('user/LOGIN', res.data);
                        this.setUserState(this.userInfo);

                        // const UserId = this.userInfo.id;
                        // api.user.getUserInfo(UserId).then((res) => {
                        //     console.log('res');
                        //     console.log(res);
                        //     // 更新缓存中userInfo的数据
                        //     this.$store.dispatch('user/LOGIN', res.data);
                        //     // console.log(this.userSetting);
                        //     this.setUserState(this.userInfo);
                        // });
                    }
                });
            },

            setCurrentTab(state) {
                this.currentTab = state;
            },

            // 更新用户密码
            updateUserPwd() {
                this.$nextTick(() => {
                    // 先校验格式
                    this.$refs.pwdSetting.validate((valid) => {
                        // 不能写在这 因为不知道原密码对不对
                        // if (this.pwdSetting.newPwd == this.pwdSetting.oldPwd) {
                        //     Message({
                        //         message: '新密码不可与原密码相同,请重新输入',
                        //         type: 'error'
                        //     });
                        //     this.pwdSetting.oldPwd = '';
                        //     this.pwdSetting.newPwd = '';
                        //     this.pwdSetting.reNewPwd = '';
                        //     return;
                        // }
                        const params = {
                            ...this.pwdSetting,
                            userId: this.userInfo.id
                        };
                        api.user.updateUserPwd(params).then((res) => {
                            console.log(res);
                            if (res.status == 1001) {
                                Message({
                                    message: '原始密码错误',
                                    type: 'error'
                                });
                                this.pwdSetting.oldPwd = '';
                                this.pwdSetting.newPwd = '';
                                this.pwdSetting.reNewPwd = '';
                            } else if (res.status === 1009) {
                                Message({
                                    message: '新密码不可与原密码相同,请重新输入',
                                    type: 'error'
                                });
                                this.pwdSetting.oldPwd = '';
                                this.pwdSetting.newPwd = '';
                                this.pwdSetting.reNewPwd = '';
                                return;
                            }
                            if (res.status == 200) {
                                Message({
                                    message: '密码修改成功,请重新登录',
                                    type: 'success'
                                });
                                removeCookie();
                                this.$store.dispatch('user/LOGOUT');
                                this.$router.replace('/chatLogin');
                            }
                        });
                    });
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    li {
        list-style: none;
    }
    .setting {
        width: 50%;
        height: 100%;
        margin: 0 auto;
        background-color: rgba(245, 245, 245, 0.3);
        box-shadow: 0 0 0.3125rem #e0dfdf;
        font-size: 16px;
        .header {
            height: 7.8125rem;
            padding: 20px 0 0 20px;
            img {
                width: 100px;
                height: 100%;
                float: left;
            }
            .info-list {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding-left: 40px;
                height: 100%;
                justify-content: center;
                .info-item {
                    padding: 2px 0;
                    span {
                        padding-right: 2px;
                    }
                }
            }
        }

        .body {
            .nav-list {
                margin: 30px 0 15px 0;
                display: flex;
                border-bottom: 2px solid;
                border-color: #f5efef;
                /* padding-bottom: 15px; */

                .operation-text {
                    margin-left: 20px;
                    padding: 5px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .operation-text:hover {
                    color: #fff;
                    background-color: #b0d9ef;
                    border-radius: 2px;
                }
                .isactive {
                    background-color: #b0d9ef;
                    color: #fff;
                }
            }
            .editContent {
                margin-top: 1.25rem;

                .content {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    margin: 0 0.625rem;

                    .setting-item {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;

                        height: 5rem;
                        padding: 1.25rem 0;
                        border-bottom: 0.0625rem solid #000;
                        > span {
                            width: 5rem;
                            /* margin-left: 0.9375rem; */
                            /* text-align: left; */
                            text-align: center;
                            float: left;
                            /* flex: 0.23; */
                        }
                        input {
                            /* box-sizing: content-box; */
                            /* width: 18.75rem; */
                            margin: 0 1.875rem;
                            border: none;
                            /* padding: 10px 0; */
                            background: rgba(225, 225, 225, 0.2);
                            /* background: rgba(164, 88, 88, 0.2); */
                            height: 2.5rem;
                            flex: 1;
                            outline: none;
                            padding-left: 0.9375rem;
                            font-size: 16px;
                        }
                        .action {
                            float: right;
                            .operation-text,
                            .operation-text-info,
                            .operation-text-save {
                                color: #00a6ff;
                                padding: 0.25rem;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                width: 45px;
                                display: inline-block;
                            }

                            .operation-text:hover {
                                background-color: rgba(92, 202, 246, 0.2);
                                border-radius: 0.1875rem;
                                /* transform: translateZ(0); */
                            }
                            .operation-text-save:hover {
                                background-color: #67c23a;
                                border-radius: 0.1875rem;
                                color: #fff;
                            }
                            .operation-text-info:hover {
                                background-color: #909399;
                                border-radius: 0.1875rem;
                                color: #fff;
                            }
                        }
                    }
                    .password-item {
                        margin-top: 20px;
                        /deep/ .el-form-item__content {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            > span {
                                width: 7rem;
                                text-align: center;
                                float: left;
                                margin-right: 10px;
                            }
                            .el-form-item__error {
                                left: 22%;
                            }
                        }
                    }
                    .btn {
                        margin: 30px 20px;
                        .check {
                            float: right;
                        }
                    }
                }
            }
        }
    }
</style>
