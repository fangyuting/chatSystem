<template>
    <div class="fenzuConversation">
        <div class="search">
            <input type="text" placeholder="添加分组" />
            <button class="btn">添加</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'fenzuConversation',
        data() {
            return {
                search: ''
            };
        }
    };
</script>

<style lang="scss" scoped>
    .fenzuConversation {
        height: 100vh;
        .search {
            display: flex;
            align-items: center;
            justify-content: center;
            input {
                width: 300px;
                height: 30px;
                margin-right: 20px;
                border: 1px solid rgb(225, 223, 223);
                border-radius: 4px;
                padding-left: 15px;
                color: #d0cfcf;
            }
            .btn {
                width: 70px;
                background-color: #8bc56f;
                border: none;
                height: 30px;
                line-height: 30px;
                border-radius: 4px;
                color: #fff;
            }
        }
    }
</style>
