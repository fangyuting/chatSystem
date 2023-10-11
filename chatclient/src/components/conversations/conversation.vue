<template>
    <div class="conversation">
        <topSearch></topSearch>
        <todo></todo>
        <conversationList></conversationList>
    </div>
</template>

<script>
    import todo from './todo';
    import topSearch from './topSearch';
    import conversationList from './conversationList';
    export default {
        name: 'conversation',
        components: {
            topSearch,
            todo,
            conversationList
        }
        //     sockets: {
        //         connect: function () {
        //             console.log('socket connected', this.$socket.id);
        //         },
        //         onlineUser(data) {
        //             console.log('当前在线用户列表', data);
        //             const onlineUserIdArr = Object.values(data).map((item) => item._id);
        //             this.$store.dispatch('app/SET_ONLINE_USER', onlineUserIdArr);
        //         },
        //         receiveMessage(news) {
        //             this.$refs['audio'].play();
        //             console.log('收到新消息', news);
        //             const message = news.message ? news.message.slice(0, 10) : '';
        //             this.$notify({
        //                 title: '收到新消息',
        //                 message,
        //                 type: 'success'
        //             });
        //             this.$store.dispatch('news/SET_UNREAD_NEWS', {
        //                 roomid: news.roomid,
        //                 count: 1,
        //                 type: 'ADD'
        //             });
        //             const senderConversation = this.allConversation.find(
        //                 (item) => item.roomid === news.roomid
        //             );
        //             this.$store.dispatch('app/SET_RECENT_CONVERSATION', {
        //                 type: 'add',
        //                 data: senderConversation
        //             });
        //             this.$store.dispatch('news/SET_LAST_NEWS', {
        //                 type: 'edit',
        //                 res: {
        //                     roomid: news.roomid,
        //                     news: news
        //                 }
        //             });
        //             saveRecentConversationToLocal(news.senderId);
        //         },
        //         receiveValidateMessage(news) {
        //             this.$refs['audio'].play();
        //             console.log('收到新的验证消息', news);
        //             this.$store.dispatch('news/SET_UNREAD_NEWS', {
        //                 roomid: news.roomid,
        //                 count: 1,
        //                 type: SET_UNREAD_NEWS_TYPE_MAP.add
        //             });
        //         },
        //         receiveAgreeFriendValidate(data) {
        //             console.log('receiveAgreeFriendValidate', data);
        //         },
        //         conversationList(list) {
        //             // console.log("当前会话列表", list)
        //         },
        //         /**
        //          * 发送的消息被对方读取了
        //          */
        //         isReadMsg(val) {
        //             console.log('isReadMsg', val);
        //             const { roomid, status } = val;
        //             this.$store.dispatch('news/SET_USER_IS_READ_MSG', {
        //                 roomid,
        //                 status
        //             });
        //         }
        //     }
    };
</script>

<style lang="scss" scoped></style>
