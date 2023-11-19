<!-- 登录页 -->
<template>
    <div class="login">
        <el-row class="main_login">
            <!-- 右边图片部分 -->
            <el-col :span="12" class="left_image">
                <img src="../../static/image/Illustration.png" alt="" />
            </el-col>
            <!-- 左边登录或注册部分 -->
            <el-col :span="12" class="right_login">
                <span class="signup">{{ isLoginState ? 'Sign Up' : 'Register' }}</span>

                <el-form
                    :model="currentInfo"
                    :rules="rules"
                    style="max-width: 460px"
                    ref="currentInfo"
                >
                    <!-- 账号 -->
                    <el-form-item label="" prop="account">
                        <el-input v-model="currentInfo.account" placeholder="请输入账号" />
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item label="" prop="password">
                        <el-input
                            placeholder="请输入密码"
                            v-model="currentInfo.password"
                            type="password"
                        />
                    </el-form-item>
                    <!-- 确认密码（仅在注册时显示） -->
                    <el-form-item v-if="!isLoginState" label="" prop="repassword">
                        <el-input
                            placeholder="请确认密码"
                            v-model="currentInfo.repassword"
                            type="password"
                        />
                    </el-form-item>
                    <!-- 验证码 -->
                    <el-form-item label="" class="cv-code" prop="cvCode">
                        <div class="cv">
                            <el-input
                                v-model="currentInfo.cvCode"
                                placeholder="验证码(不区分大小写)"
                                class="codeInput"
                            />
                            <canvas
                                width="120"
                                height="40"
                                ref="currentCanvas"
                                @click="getCVCode"
                            ></canvas>
                        </div>
                    </el-form-item>
                </el-form>

                <el-button type="primary" class="btn" v-if="this.isLoginState" @click="login">
                    {{ isLoginState ? 'Sign up' : 'Register' }}
                </el-button>
                <el-button type="primary" class="btn" v-else @click="register">
                    {{ isLoginState ? 'Sign up' : 'Register' }}
                </el-button>
                <span class="register">
                    {{ isLoginState ? '没有账号?' : '已有账号?' }}
                    <span @click="toggleState">{{ isLoginState ? '注册' : '登录' }}</span>
                </span>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { h } from 'vue';
    import canvasImg from '../../static/image/canvas2.jpg';
    import api from '../api/index';
    import { createCanvas } from '../utils/cvcode';
    import { Message } from 'element-ui';

    export default {
        name: 'Login',

        data() {
            // 一定要放上面 不然报错
            const validateRepassword = async (rule, value, callback) => {
                console.log(this.currentInfo);
                if (value === this.currentInfo.password) {
                    callback();
                } else {
                    callback(new Error('两次输入的密码不一致'));
                }
            };
            return {
                // 登录信息
                accountInfo: {
                    account: '', // 账号
                    password: null, // 密码
                    cvCode: null, // 验证码
                    cvCodeTimestamp: '', // 时间戳
                    avatar: JSON.parse(window.localStorage.getItem('userInfo') || '{}').photo || '' // 头像
                },
                // 注册信息
                registerInfo: {
                    account: '', // 账号
                    password: null, // 密码
                    repassword: null,
                    cvCode: null, // 验证码
                    cvCodeTimestamp: '' // 时间戳
                },
                // 登录状态
                isLoginState: true,

                cvCode: '', // 验证码
                cvCoding: true, // 正在获取验证码?

                // 校验规则
                rules: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        {
                            min: 3,
                            max: 10,
                            message: '请输入3-10位的账号',
                            trigger: 'blur'
                        }
                    ],
                    password: [
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
                    repassword: [
                        { required: true, message: '请确认密码', trigger: 'blur' },
                        {
                            validator: validateRepassword,
                            message: '两次输入密码不一致',
                            trigger: 'blur'
                        }
                    ],
                    cvCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
                }
            };
        },
        computed: {
            // 当前账号信息
            currentInfo() {
                return this.isLoginState ? this.accountInfo : this.registerInfo;
            }
        },
        created() {
            this.getCVCode();
        },

        methods: {
            // 改变状态 登录/注册
            toggleState() {
                this.currentInfo.account = '';
                this.currentInfo.password = '';
                this.currentInfo.repassword = '';
                this.currentInfo.cvCode = '';
                this.currentInfo.cvCodeTimestamp = '';
                this.isLoginState = !this.isLoginState;
                this.getCVCode();
            },
            // 获取验证码
            getCVCode() {
                // console.log('cvCode');

                this.cvCoding = true;
                api.user.getCVCode().then((res) => {
                    if (res.status == 200) {
                        const { data, status, timestamp } = res;
                        // console.log('cvCoderes', res);
                        // console.log('data.data', data);
                        this.cvCode = data;
                        // console.log(this.cvCode);

                        this.cvCoding = true;
                        this.currentInfo.cvCodeTimestamp = timestamp;

                        this.$nextTick(() => {
                            const currCanvas = this.$refs.currentCanvas;
                            createCanvas(this.cvCode, currCanvas, canvasImg, () => {
                                this.coding = false;
                            });
                        });
                    }
                });
            },

            // 登录
            login() {
                console.log('login...');
                // console.log(this.currentInfo);

                /* 登陆失败的几种情况:
                                    1. 验证码错误 1002
                                    2. 验证码过期 1002
                                    3. 账户错误   1001
                                    4. 密码错误   1001
                                    5. 账户被冻结 1006
                                    6. 账户被注销 1007
                */

                // 校验form表单内容是否正确
                // $nextTick 将回调函数延迟在下一次dom更新数据后调用,当数据更新了，在dom中渲染后，自动执行该函数
                this.$nextTick(() => {
                    // 先校验格式
                    this.$refs.currentInfo.validate((valid) => {
                        if (valid) {
                            api.user.login(this.currentInfo).then((res) => {
                                let { status, data, msg } = res;
                                // console.log('loginres', res);
                                // console.log('loginstatus', status);
                                // console.log('loginmsg', msg);
                                if (status === 1001) {
                                    Message({
                                        message: '账号/密码错误',
                                        type: 'error'
                                    });
                                    this.currentInfo.account = '';
                                    this.currentInfo.password = '';
                                    return;
                                } else if (status === 1008) {
                                    this.$alert(
                                        '用户账号被冻结,请联系管理员 shirleyicon@gmail.com',
                                        'Warning',
                                        {
                                            confirmButtonText: 'OK'
                                        }
                                    );
                                    return;
                                } else if (status === 1007) {
                                    this.$alert(
                                        '用户账号注销,如需回复请联系管理员 shirleyicon@gmail.com',
                                        'Warning',
                                        {
                                            confirmButtonText: 'OK'
                                        }
                                    );
                                    return;
                                } else if (status === 1002) {
                                    if (msg == '验证码已过期') {
                                        Message({
                                            message: '验证码已过期',
                                            type: 'warning'
                                        });
                                        this.currentInfo.cvCode = '';
                                        this.getCVCode();
                                    } else if (msg == '验证码错误') {
                                        Message({
                                            message: '验证码错误',
                                            type: 'warning'
                                        });
                                        this.currentInfo.cvCode = '';
                                        this.getCVCode();
                                    }
                                    return;
                                }

                                if (status === 1000) {
                                    this.$store.dispatch('user/LOGIN', data);
                                    this.$notify({
                                        title: `Hello ${this.currentInfo.account}`,
                                        message: '登录成功 ! ! !',
                                        type: 'success',
                                        showClose: false,
                                        duration: 2000
                                    });
                                    // window.localStorage.setItem(
                                    //     'account',
                                    //     this.currentInfo.account
                                    // );

                                    const redirect = this.$router.currentRoute.query.redirect;
                                    // console.log(redirect);
                                    const next = redirect ? redirect : '/chat';

                                    // 路由导航到其他页面
                                    this.$router.replace(next);
                                    this.$socket.emit('login', this.currentInfo.account);

                                    // 清空数据
                                    this.currentInfo.account = '';
                                    this.currentInfo.password = '';
                                    this.currentInfo.repassword = '';
                                    this.currentInfo.cvCode = '';
                                    this.currentInfo.cvCodeTimestamp = '';
                                    // this.$socket.connect();
                                    // this.$socket.on('connect', () => {
                                    //     console.log('Socket.IO连接成功！');
                                    //     this.$socket.emit('login', this.currentInfo.account);
                                    // });
                                }
                            });
                        } else {
                            console.log('表单校验失败');
                        }
                    });
                });
            },

            /*
                    this.$nextTick 接受一个回调函数作为参数。这个回调函数会在下一个 DOM 更新周期时被执行，
                    确保在回调函数中的代码在 Vue 实例更新完毕后执行。
                    在代码中，this.$refs.currentInfo.validate 被放在了 this.$nextTick 的回调函数内，
                    因为这样可以确保表单元素已经完全渲染到 DOM 中后再进行校验。
                    如果不使用 this.$nextTick，有可能在进行校验时表单元素还没有被完全渲染，从而导致校验失败或出现其他问题。
                */

            // 注册
            register() {
                console.log('register...');
                /* 注册失败的几种情况:
                                    1. 验证码错误 1002
                                    2. 验证码过期 1002
                                    3. 账户已存在 1003
                                    4. bug 1004
                */

                // 校验form表单内容是否正确
                this.$nextTick(() => {
                    this.$refs.currentInfo.validate((valid) => {
                        if (valid) {
                            api.user.register(this.currentInfo).then((res) => {
                                const { status, data, msg } = res;
                                console.log('registerres', res);
                                console.log(status);
                                console.log(data);
                                // 账号已被注册
                                if (status === 1003) {
                                    Message({
                                        message: '账号已被注册',
                                        type: 'error'
                                    });
                                    this.currentInfo = {
                                        account: '', // 账号
                                        password: null, // 密码
                                        repassword: null,
                                        cvCode: null // 验证码
                                    };
                                } else if (status === 1002) {
                                    if (msg == '验证码已过期') {
                                        Message({
                                            message: '验证码已过期',
                                            type: 'warning'
                                        });
                                        this.currentInfo.cvCode = '';
                                        this.getCVCode();
                                    } else if (msg == '验证码错误') {
                                        Message({
                                            message: '验证码错误',
                                            type: 'warning'
                                        });
                                        this.currentInfo.cvCode = '';
                                        this.getCVCode();
                                    }
                                    return;
                                } else if (status === 1005) {
                                    Message({
                                        message: '注册成功,请登录！',
                                        type: 'success'
                                    });
                                    // this.currentInfo.cvCode = '';
                                    console.log('currentInfo', this.currentInfo);
                                    this.toggleState();
                                    console.log('currentInfo', this.currentInfo);
                                    this.currentInfo.account = data.name;
                                } else if (status === 10001) {
                                    Message({
                                        message: msg,
                                        type: 'warning'
                                    });
                                }
                            });
                        } else {
                            console.log('表单校验失败');
                        }
                    });
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .login {
        min-width: 75rem; /* 设置最小宽度,防止因缩放导致内容挤压 */
        width: 100vw;
        height: 100vh;
        .main_login {
            display: flex;
            flex-direction: row;
            height: 100vh;
            .left_image {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: center;
            }
        }

        .right_login {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .signup {
                font-size: 1.75rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
            }
            .el-input {
                width: 25rem;
                height: 3rem;
                min-width: 0.625rem;
            }
            /* /deep/ 样式穿透 */
            /deep/ .el-input__inner {
                height: 3rem;
            }

            .btn {
                margin-top: 0.625rem;
                font-size: 1rem;
                width: 15rem;
                height: 2.5rem;
                border-radius: 0.5rem;
            }
            .register {
                display: block;
                font-size: 0.875rem;
                margin-top: 0.625rem;
                span {
                    color: rgb(60, 116, 227);
                }
                span:hover {
                    cursor: pointer;
                }
            }
            .cv-code {
                .codeInput {
                    line-height: 3.125rem;
                    width: 15.625rem;
                    margin-right: 1.875rem;
                }
                .cv {
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
</style>
