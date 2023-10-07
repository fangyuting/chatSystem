<template>
    <div class="groupConversation">
        <el-collapse accordion>
            <el-collapse-item title="我创建的群聊" class="topItem">
            </el-collapse-item>
            <el-collapse-item title="我管理的群聊"> </el-collapse-item>
            <el-collapse-item title="我加入的群聊"> </el-collapse-item>
        </el-collapse>

        <div class="addGroup">
            <i
                title="创建群聊"
                class="el-icon-circle-plus box-shadow1 circle"
                @click="createGroup"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'groupConversation',
    data() {
        return {};
    },
    methods: {
        createGroup() {}
    }
};
</script>

<style lang="scss" scoped>
.groupConversation {
    height: 100vh;
    width: 1;
    .el-collapse {
        border-top: none;
    }
    .addGroup {
        position: fixed;
        bottom: 15px;
        left: 19%;
        font-size: 55px;
        color: hsla(201, 100%, 55%, 1);
        cursor: pointer;
    }
}
</style>