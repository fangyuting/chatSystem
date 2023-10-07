<template>
    <div class="chathome">
        <transition name="fade-left">
            <div class="conversation-list">
                <conversation></conversation>
            </div>
        </transition>

        <transition name="fade-right">
            <div class="conversation-chat-area">
                <div class="no-conversation hor-ver-center">
                    <chat-svg width="400" height="300" />
                    <p>聊天~打开心灵的窗户</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import conversation from '@/components/conversations/conversation';
    import chatSvg from '@/SVGComponents/chat';

    export default {
        components: {
            conversation,
            chatSvg
        }
    };
</script>

<style lang="scss" scoped>
    .chathome {
        display: flex;
        width: 100%;
        height: 100%;
        .conversation-list {
            width: 20%;
            background-color: rgba(238, 236, 236, 0.3);
            border-right: 0.0625rem solid rgba(173, 171, 171, 0.3);
            /* background-color: gray; */
        }
        .conversation-chat-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 80%;
            .no-conversation {
                text-align: center;
                /* height: 100%; */
            }
        }
    }
</style>
