<template>
    <div class="topsearch">
        <div class="header">
            <el-input v-model="search" placeholder="请输入内容" class="normal-input"></el-input>
        </div>
        <transition name="slide-down"></transition>
    </div>
</template>

<script>
    export default {
        name: 'topSearch',
        data() {
            return {
                search: ''
            };
        }
    };
</script>

<style lang="scss" scoped>
    .topsearch {
        width: 100%;
        margin-top: 20px;
        .normal-input {
            width: 90%;
        }
    }
</style>
