<template>
    <div id="app">
        <!-- 
            缓存路由组件 让不展示的路由组件保持挂载，不被销毁
            <keep-alive include="News"><router-view></router-view></keep-alive>
         -->
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>
<script>
    export default {
        name: 'App',
        data() {
            return {};
        },
        sockets: {
            disconnect() {
                alert('Socket 断开');
            },

            connect() {
                console.log('Socket 连接成功');
                // this.OnImageSocket();
            },
            linkSuccess(val) {
                console.log('linkSuccess :>>', val);
            }
        },
        mounted() {
            this.$socket.emit('hello', '服务器你收到了吗? halohalo');
        }
    };
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
