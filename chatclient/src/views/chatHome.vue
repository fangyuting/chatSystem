<template>
    <div class="chathome">
        <transition name="fade-left">
            <div class="conversation-list">
                <conversation></conversation>
            </div>
        </transition>

        <transition name="fade-right">
            <div class="conversation-chat-area">
                <conversationArea></conversationArea>
                <div class="no-conversation hor-ver-center">
                    <!-- <chat-svg width="400" height="300" /> -->
                    <img src="../../static/image/Illustration-1.png" alt="" />
                    <!-- <p>聊天~打开心灵的窗户</p> -->
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import conversation from '@/components/conversations/conversation';
    import chatSvg from '@/SVGComponents/chat';
    import conversationArea from '@/components/conversations/conversationArea';

    export default {
        components: {
            conversation,
            chatSvg
        }
    };
</script>

<style lang="scss" scoped>
    .chathome {
        min-width: 62.5rem; /* 设置最小宽度,防止因缩放导致内容挤压 */
        display: flex;
        width: 100%;
        height: 100%;
        padding: 1.25rem;
        overflow: hidden;
        align-items: center;
        .conversation-list {
            width: 25%;
            height: 100%;
            background-color: #f7f7f8;
            /* border-right: 0.0625rem solid rgba(173, 171, 171, 0.3); */
            /* background-color: gray; */
        }
        .conversation-chat-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 75%;
            height: 100%;
            /* border: 1px solid #000; */
            margin: 1.25rem 0;
            border-radius: 0.3125rem;
            background-color: #fff;
            box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);

            .no-conversation {
                text-align: center;
                /* height: 100%; */
            }
        }
    }
</style>
