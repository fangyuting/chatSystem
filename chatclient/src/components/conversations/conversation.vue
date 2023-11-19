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
    };
</script>

<style lang="scss" scoped>
    .conversation {
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        height: 100%;
    }
</style>
