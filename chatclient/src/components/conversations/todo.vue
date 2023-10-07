<template>
    <div class="todo" @click="goSchedule">
        <i class="el-icon-circle-check" style="font-size: 20px"></i>
        <span>今日待办: {{ 0 }}</span>
    </div>
</template>

<script>
    export default {
        name: 'todo',
        data() {
            return {};
        },
        methods: {
            goSchedule() {
                this.$router.push({ path: '/chat/schedule' });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .todo {
        margin: 20px;
        align-items: center;
        display: flex;
        border: 1px solid rgb(233, 233, 233);
        box-shadow: 0 0 5px #e1e1e1;
        border-radius: 4px;
        padding: 10px;
        cursor: pointer;
        span {
            margin-left: 10px;
        }
    }
</style>
