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
                <span slot="label"> <i class="el-icon-user"></i></span>
                <fenzuConversation></fenzuConversation>
            </el-tab-pane>
            <el-tab-pane class="tab-pane">
                <span slot="label">
                    <i style="fontsize: 16px" class="icon-qunzu iconfont"></i>
                </span>
                <groupConversation></groupConversation>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import recentConversation from './recentConversation.vue';
import fenzuConversation from './fenzuConversation.vue';
import groupConversation from './groupConversation.vue';
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
.conversationList {
}
</style>