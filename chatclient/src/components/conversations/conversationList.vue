<template>
    <div class="conversationList">
        <el-tabs type="border-card" stretch>
            <el-tab-pane class="tab-pane">
                <!-- slot 定义标签页内容 -->
                <span slot="label">
                    <i class="el-icon-chat-line-round"></i>
                </span>
                <recentConversation></recentConversation>
            </el-tab-pane>

            <el-tab-pane class="tab-pane">
                <span slot="label"><i class="el-icon-user"></i></span>
                <fenzuConversation></fenzuConversation>
            </el-tab-pane>
            <el-tab-pane class="tab-pane3">
                <span slot="label">
                    <i style="font-size: 16px" class="icon-qunzu iconfont"></i>
                </span>
                <groupConversation></groupConversation>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import recentConversation from '../conversationList/recentConversation.vue';
    import fenzuConversation from '../conversationList/fenzuConversation.vue';
    import groupConversation from '../conversationList/groupConversation.vue';
    export default {
        name: 'conversationList',
        data() {
            return {};
        },
        components: {
            recentConversation,
            fenzuConversation,
            groupConversation
        }
    };
</script>

<style lang="scss" scoped>
    @import '../../../static/iconfont/iconfont.css';
    .conversationList {
        /* margin-bottom: 20px; */
        border-radius: 5px;
        height: 83.9%;
        flex: 1;
        /deep/ .el-tabs--border-card {
            height: 100%;
            border: none;
            border-radius: 10px;
            > .el-tabs__content {
                height: 74vh;
            }
        }
        /deep/ .el-tabs__nav-scroll {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .tab-pane3 {
            height: 100%;
        }
    }
</style>
