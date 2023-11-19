<template>
    <div class="allMzone">
        <div class="bgc">
            <img src="../../../static/image/wallpaper1.jpg" alt="" class="mzone-bgc" />
            <!-- <div class="userInfo"> -->
            <img src="../../../static/image/touxiang.jpg" alt="" class="avatar" />
            <!-- <span>fyt</span> -->
            <!-- </div> -->
        </div>

        <div class="menu">
            <el-menu
                :default-active="activeIndex"
                @select="tabSelect"
                class="el-menu-demo"
                mode="horizontal"
            >
                <el-menu-item index="friend-mzone" @click="getMyFriendPyqNews">
                    好友动态
                </el-menu-item>
                <el-menu-item index="my-mzone" @click="getMyMzone">我的空间</el-menu-item>
                <el-menu-item index="my-blog">博客</el-menu-item>
            </el-menu>
        </div>

        <!-- 在父组件中通过ref属性引用子组件，然后就可以通过这个引用调用子组件的方法。 -->
        <transition name="component-fade" mode="out-in">
            <div v-show="activeIndex == 'friend-mzone'" class="content">
                <friendMzone ref="friendMzoneRef"></friendMzone>
            </div>
        </transition>
        <transition name="component-fade" mode="out-in">
            <div v-show="activeIndex == 'my-mzone'" class="content">
                <myMzone ref="myMzoneRef"></myMzone>
            </div>
        </transition>
        <transition name="component-fade" mode="out-in">
            <div v-show="activeIndex == 'my-blog'" class="content">
                <myBlog ref="myBlogRef"></myBlog>
            </div>
        </transition>
    </div>
</template>
<script>
    import friendMzone from './friendMzone';
    import myBlog from './myBlog';
    import myMzone from './myMzone';

    export default {
        name: 'allMzone',
        components: { friendMzone, myBlog, myMzone },
        mixins: [],
        props: {},
        data() {
            return {
                handleSelect: '',
                activeIndex: 'friend-mzone'
                // userName: JSON.stringify(window.localStorage.getItem('userInfo')).name
            };
        },
        computed: {},
        watch: {
            activeIndex() {
                console.log('1');
            }
        },

        methods: {
            tabSelect(index) {
                this.activeIndex = index;
            },
            handleScroll() {
                const scrollPosition = window.scrollY;
                // console.log(scrollPosition);
                const maxOpacityScroll = 50; // 设置滚动位置，在该位置图片完全透明
                const opacity = 1 - Math.min(scrollPosition / maxOpacityScroll, 1);
                document.querySelector('.mzone-bgc').style.opacity = opacity;
            },

            getMyFriendPyqNews() {
                // 在父组件中通过 ref 调用子组件的方法
                this.$refs.friendMzoneRef.getMyFriendPyqNews();
                // console.log('getMyFriendPyqNews');
            },

            getMyMzone() {
                // 在父组件中通过 ref 调用子组件的方法
                this.$refs.myMzoneRef.getMyMzone();
                // console.log('getMyMzone111');
            }
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll);
        },
        beforeDestroy() {
            // window.removeEventListener('scroll', this.handleScroll);
        }
    };
</script>
<style lang="scss" scoped>
    .allMzone {
        width: 100%;
        height: 100%;
        overflow: auto;

        display: flex;
        flex-direction: column;
        .bgc {
            width: 100%;
            /* background: url('../../../static/image/wallpaper1.jpg');
            background-repeat: no-repeat; */
            height: 250px;
            position: relative;
            margin-bottom: 25px;
            /* flex: 0.25; */
            .mzone-bgc {
                height: 250px;
                width: 100%;
                border-top-left-radius: 0.3125rem;
                border-top-right-radius: 0.3125rem;
                transition: opacity 0.3s ease;
                opacity: 1;
            }
            /* .userInfo { */
            /* display: flex; */
            /* flex-direction: row; */

            .avatar {
                position: absolute;
                bottom: -25px;
                left: 20px;
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
            /* } */
        }
        .menu {
            margin-bottom: 20px;
        }
        .content {
        }
    }
    /* 不显示滚动条也可以滚动 */
    .allMzone::-webkit-scrollbar {
        display: none;
    }
    .component-fade-enter-active,
    .component-fade-leave-active {
        transition: opacity 0.5s ease;
    }
    .component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
        opacity: 0;
    }
</style>
