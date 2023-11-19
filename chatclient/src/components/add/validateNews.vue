<template>
    <!-- 好友验证申请列表 -->
    <div class="validateNewsList">
        <transition-group name="slide" mode="out-in" class="validateNews-transition">
            <div v-for="item in validateNewsResults" :key="item.id" class="validateNewsItem">
                <el-form class="validateNewsForm" v-if="item.validateType == '0'">
                    <div class="item-left">
                        <img src="../../../static/image/touxiang.jpg" alt="" />
                    </div>
                    <div class="item-right">
                        <!-- <span>Code: {{ item.senderId }}</span> -->
                        <span>
                            {{ item.senderName }}
                            <span>请求添加您为好友</span>
                        </span>
                        <span>{{ item.senderNickname }}</span>
                        <span>附加信息: {{ item.additionMessage }}</span>
                        <div class="btn" v-if="item.status == 0">
                            <button class="agree-btn" @click="agreeValidate(item)">同意</button>
                            <button class="reject-btn">拒绝</button>
                        </div>
                        <div class="btn" v-if="item.status == 1">
                            <button class="agree-btn">已同意</button>
                        </div>
                        <div class="btn" v-if="item.status == 2">
                            <button class="reject-btn">已拒绝</button>
                        </div>
                    </div>
                </el-form>
                <el-form class="validateNewsForm" v-else-if="item.validateType == '1'">
                    <div class="item-left">
                        <img src="../../../static/image/touxiang.jpg" alt="" />
                    </div>
                    <div class="item-right">
                        <span>
                            {{ item.senderName }}
                            <span>请求进群 {{ item.groupName }}</span>
                        </span>
                        <span>附加信息: {{ item.additionMessage }}</span>
                        <div class="btn" v-if="item.status == 0">
                            <button class="agree-btn" @click="agreeValidate(item)">同意</button>
                            <button class="reject-btn">拒绝</button>
                        </div>
                        <div class="btn" v-if="item.status == 1">
                            <button class="agree-btn">已同意</button>
                        </div>
                        <div class="btn" v-if="item.status == 2">
                            <button class="reject-btn">已拒绝</button>
                        </div>
                    </div>
                </el-form>
            </div>
        </transition-group>
    </div>
</template>

<script>
    export default {
        name: 'validateNews',
        data() {
            return {
                // validateNewsResults: [], // 新的申请信息
                isAdding: false
            };
        },
        computed: {
            validateNewsResults() {
                return this.$store.state.add.validateNewsResults;
            }
        },
        created() {
            this.$emit('refreshValidateNews'); // 发送事件通知父组件刷新数据
        },
        mounted() {},
        methods: {
            // 同意好友申请
            agreeValidate(item) {
                console.log('item', item);
                // item.status = '1';
                if (item.validateType == '0') {
                    const data = {
                        reveiverId: item.reveiverId,
                        senderId: item.senderId
                    };
                    this.$socket.emit('sendAgreeFriendValidate', data);
                    this.isAdding = true;
                } else if (item.validateType == '1') {
                    const data = {
                        groupId: item.groupId,
                        senderId: item.senderId,
                        senderName: item.senderName
                    };
                    this.$socket.emit('sendAgreeGroupValidate', data);
                    this.isAdding = true;
                }

                setTimeout(() => {
                    this.isAdding = false;

                    // this.$emit('changeValidateNewsStatus', item, 1);
                    // this.fetchMyValidateNews();
                    this.$emit('refreshValidateNews'); // 发送事件通知父组件刷新数据
                    this.$alert('添加成功', '提示！', {
                        confirmButtonText: '确定'
                    });
                }, 500);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .validateNewsList {
        .validateNews-transition {
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

        .validateNewsItem {
            width: 100%;
            .validateNewsForm {
                width: 97%;
                height: 6.25rem;
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
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-right: 1.875rem;
                    span {
                        line-height: 1.625rem;
                        font-weight: 800;
                    }

                    .btn {
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
        }
    }
</style>
