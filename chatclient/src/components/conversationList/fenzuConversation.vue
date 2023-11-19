<template>
    <div class="fenzuConversation">
        <!-- 添加分组 -->
        <div class="search">
            <input type="text" placeholder="添加分组" v-model="newFenzu" maxlength="6" />
            <button class="btn" @click="addFenzu">添加</button>
        </div>

        <!-- 分组列表 -->
        <div class="fenzu">
            <el-collapse v-for="(item, index) in fenzuKeys" :key="index">
                <el-collapse-item :title="item">
                    <template slot="title">
                        <span>{{ item }} ({{ fenzuMap[item].length }})</span>
                    </template>

                    <div v-for="friend in fenzuMap[item]" :key="friend">
                        <div v-for="user in friendList" :key="user.id">
                            <div
                                v-if="user.id == friend"
                                class="fenzuItem"
                                @contextmenu.prevent="openMenu($event, item, user)"
                            >
                                <!-- item fenzuKeys的item  user fenzuList的user -->
                                <!-- <img src="../../../static/image/touxiang.jpg" alt="" /> -->
                                <img src="http://localhost:8888/img/picture.png" />
                                <div class="info">
                                    <div class="friendItem">{{ user.name }}</div>
                                    <el-tooltip
                                        class="item"
                                        effect="light"
                                        :content="user.signature"
                                        placement="bottom-start"
                                        v-if="user.signature !== ''"
                                    >
                                        <div class="signature">个性签名: {{ user.signature }}</div>
                                    </el-tooltip>
                                    <div v-else>
                                        <!-- <span class="signatureItem"></span> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>

        <ul
            v-if="showContextMenu"
            :style="{ left: left + 'px', top: top + 'px' }"
            class="contextmenu"
        >
            <li @click="viewProfile">查看资料</li>
            <li>修改备注</li>
            <li @click="switchFenzu">切换分组</li>
            <li @click="deleteFriend">删除好友</li>
        </ul>

        <el-dialog
            title="切换分组"
            :visible.sync="switchDialogVisible"
            width="25%"
            class="modifyDialog"
        >
            <el-radio
                v-model="chooseFenzu"
                :label="item"
                v-for="(item, index) in fenzuKeys"
                :key="index"
            >
                {{ item }}
            </el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button @click="switchDialogVisible = false">取 消</el-button>
                <el-button @click="modifyFriendFenzu" type="primary">确 定</el-button>
            </span>
        </el-dialog>

        <transition-group name="slide" mode="out-in" class="profileDialog-transition">
            <el-dialog
                title="好友资料"
                v-if="profileDialogVisible"
                :visible.sync="profileDialogVisible"
                width="30%"
                class="profileDialog"
                :key="profileDialogVisible.toString()"
            >
                <div class="friend-profile">
                    <div class="friend-avatar">
                        <img src="../../../static/image/touxiang.jpg" alt="" />
                    </div>
                    <div class="profile">
                        <span>好友id: {{ this.friendProfile.id }}</span>
                        <span>好友账号: {{ this.friendProfile.name }}</span>
                        <span>好友昵称: {{ this.friendProfile.nickname }}</span>
                        <span>个性签名: {{ this.friendProfile.signature }}</span>
                    </div>
                </div>
            </el-dialog>
        </transition-group>
    </div>
</template>

<script>
    import api from '../../api';
    import { Message } from 'element-ui';

    export default {
        name: 'fenzuConversation',
        sockets: {
            deleteFriendInFenzu(val) {
                console.log('deleteFriendInFenzu :>>', val);
            }
        },
        data() {
            return {
                userId: '', // 用户id
                friendList: [], // 好友列表
                fenzuMap: {}, // 分组
                fenzuKeys: [], // 分组键
                newFenzu: '', // 新分组名
                showContextMenu: false, // 展示右键菜单
                left: 0,
                top: 0,
                switchDialogVisible: false, // 切换分组对话框
                nowFenzuName: 'ha', // 当前用户所在分组
                chooseFenzu: 'ha', // 选择切换到的分组
                chooseUserId: '', // 需要切换分组的用户Id

                profileDialogVisible: false, // 查看资料对话框
                friendProfile: [],
                Img_URL: 'http://localhost:8888'
            };
        },
        methods: {
            // 获取我的好友列表
            async getMyFriends() {
                console.log('getMyFriends');
                const id = JSON.parse(window.localStorage.getItem('userInfo')).id;
                this.userId = id;
                try {
                    await api.friendlies.getMyFriends(id).then((res) => {
                        console.log(res);
                        const { data } = res;
                        // 先把好友列表清空 再把返回的数据遍历到好友列表
                        this.friendList = [];
                        console.log('friendList', this.friendList);
                        data.forEach((item) => {
                            // console.log(item);
                            this.friendList.push({
                                id: item.id,
                                name: item.name,
                                nickname: item.nickname,
                                avatar: item.photo,
                                createDate: item.createDate,
                                signature: item.signature
                            });
                        });
                        console.log('friendList', this.friendList);
                        this.$store.dispatch('app/SET_ALL_FRIENDS', this.friendList);
                    });
                    this.getFenzu();
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取分组列表
            getFenzu() {
                console.log('getFenzu');
                this.fenzuMap = JSON.parse(window.localStorage.getItem('userInfo')).friendFenzu;

                let flag = 0;
                // 如果每个分组都为空的话 代表第一次进来
                for (let key in this.fenzuMap) {
                    if (this.fenzuMap[key].length !== 0) {
                        flag = 1;
                    }
                }
                if (flag == 0) {
                    // 把好友id值存入 '我的好友'
                    this.friendList.forEach((obj) => {
                        // console.log('obj', obj);
                        this.fenzuMap.我的好友.push(obj.id);
                    });

                    // console.log('fenzuMap', this.fenzuMap);
                    // this.modifyFriendFenzu();
                    // 这里属于初始化
                    const params = {
                        friendFenzu: this.fenzuMap,
                        id: this.userId
                    };
                    console.log(params);
                    api.user.modifyFriendFenzu(params).then((res) => {
                        this.$store.dispatch('user/LOGIN', res.data);
                    });
                }

                // 如果是好友在分组里 但没在好友列表里

                // 如果有新的好友没有分组 添加到我的好友分组中
                let arr = [];
                for (let key in this.fenzuMap) {
                    if (this.fenzuMap[key].length !== 0) {
                        const item = this.fenzuMap[key];
                        for (let j = 0; j < item.length; j++) {
                            for (let i = 0; i < this.friendList.length; i++) {
                                if (item[j] == this.friendList[i].id) {
                                    arr.push(item[j]); // 包含在fenzuMap和好友列表里都有 就放进arr数组里
                                }
                            }
                        }
                    }
                }
                console.log('arr', arr);

                // 遍历分组 如果id不在分组里 就删掉
                // for (let key in this.fenzuMap) {
                //     if (this.fenzuMap[key].length !== 0) {
                //         const item = this.fenzuMap[key];
                //         for (let j = 0; j < item.length; j++) {
                //             if (!arr.includes(item[j])) {
                //                 // item[j].splice(1);
                //                 item.splice(j, 1);
                //             }
                //         }
                //     }
                // }
                /* arr里的内容是fenzu列表 和 好友列表 里都存在的 好友列表从friendlies表里获取的
                 *  如果一方把另一方删了 friendlies里的记录就会被删掉 被删的一方也就获取不到好友的数据了 就会存在
                 *  好友列表里没有 但是 fenzu列表里还有的情况 这个时候就要把fenzu列表里的这个数据删掉 也就是缓存里的userInfo里的friendFenzu
                 *  删除之后把数据同步到后端服务器更新用户信息
                 */
                for (let key in this.fenzuMap) {
                    if (this.fenzuMap[key].length !== 0) {
                        const item = this.fenzuMap[key];
                        for (let j = item.length - 1; j >= 0; j--) {
                            if (!arr.includes(item[j])) {
                                // 从数组中删除不在arr数组中的ID
                                item.splice(j, 1);
                            }
                        }
                    }
                }
                console.log('this.fenzuMap', this.fenzuMap);
                const params = {
                    friendFenzu: this.fenzuMap,
                    id: this.userId
                };
                api.user.modifyFriendFenzu(params).then((res) => {
                    console.log('modifyFriendFenzu', res.data);
                    if (res.status == 200) {
                        this.$store.dispatch('user/LOGIN', res.data);
                    }
                });
                // 遍历好友列表 要是id没在arr数组里 就把他放进'我的好友'里
                for (let i = 0; i < this.friendList.length; i++) {
                    if (!arr.includes(this.friendList[i].id)) {
                        console.log(this.friendList[i]);
                        this.fenzuMap.我的好友.push(this.friendList[i].id);
                    }
                }

                // console.log(typeof this.fenzuMap);
                // console.log(fenzuKeys);
                this.fenzuKeys = Object.keys(this.fenzuMap);
                // console.log(this.fenzuKeys);
                console.log('fenzuMap', this.fenzuMap);
            },

            // 添加分组
            addFenzu() {
                console.log(this.newFenzu);
                const existingFenzu = this.fenzuKeys.indexOf(this.newFenzu); // 是否已存在该分组名
                if (existingFenzu == -1) {
                    if (this.newFenzu !== '') {
                        const userId = JSON.parse(window.localStorage.getItem('userInfo')).id;
                        const params = {
                            newFenzu: this.newFenzu,
                            id: userId
                        };
                        api.user.addNewFenzu(params).then((res) => {
                            console.log(res);
                            if (res.status == 200) {
                                // this.$store.dispatch('user/LOGIN', res.data);
                                // api.user.getUserInfo(userId).then((res) => {
                                // console.log(res);
                                this.$store.dispatch('user/LOGIN', res.data);
                                this.getFenzu();
                                // });
                                Message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.newFenzu = '';
                            }
                        });
                    } else {
                        console.log('分组名不能为空');
                        Message({
                            message: '分组名不能为空',
                            type: 'warning'
                        });
                    }
                } else {
                    Message({
                        message: '该分组名已存在',
                        type: 'warning'
                    });
                }
            },

            switchFenzu() {
                this.showContextMenu = false;
                this.switchDialogVisible = !this.switchDialogVisible;
            },
            // 切换分组
            modifyFriendFenzu() {
                this.showContextMenu = false;
                this.switchDialogVisible = !this.switchDialogVisible;
                // console.log(this.nowFenzuName);
                if (this.chooseFenzu == this.nowFenzuName) {
                    Message({
                        message: '用户已在当前分组',
                        type: 'warning'
                    });
                } else {
                    for (let key in this.fenzuMap) {
                        if (key == this.nowFenzuName) {
                            this.fenzuMap[key].splice(this.chooseUserId, 1);
                        }
                        if (key == this.chooseFenzu) {
                            console.log(this.fenzuMap[key]);
                            this.fenzuMap[key].push(this.chooseUserId);
                        }
                    }
                    const params = {
                        friendFenzu: this.fenzuMap,
                        id: this.userId
                    };
                    // console.log(params);
                    api.user.modifyFriendFenzu(params).then((res) => {
                        if (res.status == 200) {
                            Message({
                                message: '切换分组成功',
                                type: 'success'
                            });
                            this.$store.dispatch('user/LOGIN', res.data);
                        }
                    });
                }
            },
            openMenu(e, item, user) {
                this.showContextMenu = true;
                // console.log('showContextMenu', this.showContextMenu);
                // console.log(e.target);
                // console.log(item);
                // console.log(user);
                this.nowFenzuName = item;
                this.chooseFenzu = item;
                this.chooseUserId = user.id;
                // console.log(this.chooseUserId);
                // console.log(this.nowFenzuName);
                this.left = e.clientX - 158;
                this.top = e.clientY - 174;
                // console.log(e.clientX);
                // console.log(e.clientY);
            },

            handleClickOutside(event) {
                const menu = document.querySelector('.contextmenu'); // 菜单的 DOM 元素
                if (menu) {
                    // 如果点击事件触发在菜单外部，隐藏菜单
                    this.showContextMenu = false;
                }
            },

            // 删除好友
            async deleteFriend() {
                console.log(this.chooseUserId);
                this.$confirm('是否要删除此好友?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        const params = {
                            userY: this.chooseUserId,
                            userM: this.userId
                        };
                        api.friendlies.deleteFriend(params).then((res) => {
                            console.log(res);
                            if (res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                const userInfo = JSON.parse(
                                    window.localStorage.getItem('userInfo')
                                );
                                function removeIdFromFriendFenzu(idToRemove) {
                                    for (const group in userInfo.friendFenzu) {
                                        if (userInfo.friendFenzu.hasOwnProperty(group)) {
                                            const index =
                                                userInfo.friendFenzu[group].indexOf(idToRemove);
                                            if (index !== -1) {
                                                userInfo.friendFenzu[group].splice(index, 1);
                                                console.log('删除成功');
                                                // 如果你只想删除第一个匹配项，可以注释下面的 break 语句
                                                break;
                                            }
                                        }
                                    }
                                }

                                // const idToRemove = '99fe97d0-7260-11ee-b3b5-ad605b0fe6ec';
                                removeIdFromFriendFenzu(this.chooseUserId);

                                // 更新localStorage中的userInfo
                                // window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
                                // this.$store.dispatch('user/LOGIN', userInfo);
                                // const editUserInfo = JSON.parse(
                                //     window.localStorage.getItem('userInfo')
                                // );
                                // let params = {
                                //     field: 'friendFenzu', // 修改的键
                                //     value: userInfo.friendFenzu, // 修改后的值
                                //     userId: userInfo.id // 修改用户的id
                                // };
                                // api.user.updateUserInfo(params).then((res) => {
                                //     console.log(res);
                                //     this.$store.dispatch('user/LOGIN', res.data);
                                // });
                                const params = {
                                    friendFenzu: userInfo.friendFenzu,
                                    id: this.userId
                                };
                                // console.log(params);
                                api.user.modifyFriendFenzu(params).then((res) => {
                                    if (res.status == 200) {
                                        console.log(res);
                                        this.$store.dispatch('user/LOGIN', res.data);
                                        const newUserInfo = JSON.parse(
                                            window.localStorage.getItem('userInfo')
                                        );
                                        this.userId = newUserInfo.id;
                                        console.log('newUserInfo', newUserInfo);
                                        this.getMyFriends();
                                    }
                                });

                                // const val = {
                                //     userY: this.chooseUserId,
                                //     userM: this.userId
                                // };
                                // this.$socket.emit('deleteFriendInFenzu', val);
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

            viewProfile() {
                this.profileDialogVisible = true;
                console.log(this.friendList);
                console.log('chooseUserId', this.chooseUserId);
                for (let i = 0; i < this.friendList.length; i++) {
                    if (this.friendList[i].id == this.chooseUserId) {
                        this.friendProfile = this.friendList[i];
                        console.log(this.friendProfile);
                    }
                }
            }
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
        },
        created() {
            this.getMyFriends();
        },
        beforeDestroy() {
            // 在组件销毁前，移除点击事件监听器，避免内存泄漏
            document.removeEventListener('click', this.handleClickOutside);
        }
    };
</script>

<style lang="scss" scoped>
    .fenzuConversation {
        height: 71vh;
        overflow: hidden;
        .search {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            input {
                width: 80%;
                height: 1.875rem;
                margin-right: 1.25rem;
                border: 0.0625rem solid rgb(225, 223, 223);
                border-radius: 0.25rem;
                padding-left: 0.9375rem;
                color: #acabab;
                outline: none;
            }
            .btn {
                width: 4.375rem;
                background-color: #8bc56f;
                border: none;
                height: 1.875rem;
                line-height: 1.875rem;
                border-radius: 0.25rem;
                color: #fff;
                cursor: pointer;
                outline: none;
            }
        }
        .el-collapse {
            border: none;
            /deep/ .el-collapse-item__wrap {
                border-bottom: none;
            }
        }

        .fenzu {
            height: 65vh;
            overflow: auto;
            padding-bottom: 3.75rem;
            .fenzuItem {
                padding: 0.625rem;
                float: left;
                display: flex;
                align-items: center;
                width: 100%;
                height: 4.0625rem;
                border-bottom: 0.125rem solid #f8f8f8;
                transition: all 0.3s ease;
                img {
                    width: 2.8125rem;
                    height: 2.8125rem;
                    border-radius: 50%;
                }

                .info {
                    margin-left: 0.625rem;
                    height: 4.0625rem;
                    font-family: monospace;
                    text-align: left;
                    .friendItem {
                        margin: 0.3125rem;
                        /* height: 60px; */
                        cursor: pointer;
                        font-size: 1rem;
                    }
                    .signature {
                        width: 65%;
                        overflow: hidden; /*溢出的部分隐藏*/
                        white-space: nowrap; /*文本不换行*/
                        text-overflow: ellipsis; /*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/
                    }
                }
            }
            .fenzuItem:hover {
                background-color: #ebebf5;
                border-radius: 0.3125rem;
                cursor: pointer;
                /* box-shadow: 0 0 5px #e6e6e6; */
            }
        }
        /* 不显示滚动条也可以滚动 */
        .fenzu::-webkit-scrollbar {
            display: none;
        }

        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 3000;
            position: absolute;
            list-style-type: none;
            padding: 0.3125rem 0;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 400;
            color: #333;
            box-shadow: 0.125rem 0.125rem 0.1875rem 0 rgba(0, 0, 0, 0.3);
        }

        .contextmenu li {
            margin: 0;
            padding: 0.4375rem 1rem;
            cursor: pointer;
            transition: all 0.3s linear;
        }

        .contextmenu li:hover {
            background: #eee;
        }

        .modifyDialog {
            /deep/ .el-dialog__body {
                height: 25rem;
                overflow: hidden;
                overflow-y: auto;
                .el-radio {
                    border: 0.0625rem solid #efefef;
                    margin: 0.3125rem;
                    text-align: left;
                    width: 100%;
                    padding: 0.625rem;
                }
                .el-radio:hover {
                    background-color: #efefef;
                }
            }
            /* 不显示滚动条也可以滚动 */
            /deep/ .el-dialog__body::-webkit-scrollbar {
                display: none;
            }
        }

        .profileDialog-transition {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            .slide-enter-active,
            .slide-leave-active {
                transition: transform 0.6s ease;
            }
            .slide-enter {
                transform: translateY(100%);
            }
            .slide-leave-to {
                transform: translateY(100%);
            }

            .profileDialog {
                /* display: flex;
                flex-direction: row; */
                .friend-profile {
                    display: flex;
                    flex-direction: row;
                    .friend-avatar {
                        img {
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                        }
                    }
                    .profile {
                        display: flex;
                        flex-direction: column;
                        text-align: left;
                        margin-left: 20px;

                        span {
                            padding: 5px 0;
                        }
                    }
                }
            }
        }
    }
</style>
