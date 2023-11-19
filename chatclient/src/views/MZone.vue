<template>
    <div class="MZone">
        <div class="all_mzone">
            <allMzone></allMzone>
        </div>
        <div class="choose_Friend_Mzone">
            <chooseFriendMzone></chooseFriendMzone>
        </div>
    </div>
</template>

<script>
    import chooseFriendMzone from '../components/mzone/chooseFriendMzone';
    import allMzone from '../components/mzone/allMzone';
    export default {
        name: 'MZone',
        components: { chooseFriendMzone, allMzone }
    };
</script>

<style lang="scss" scoped>
    .MZone {
        min-width: 62.5rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        padding: 1.25rem;
        overflow: hidden;
        align-items: center;

        .all_mzone {
            /* display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center; */
            width: 75%;
            height: 100%;
            margin: 1.25rem 0;
            border-radius: 0.3125rem;
            background-color: #fff;
            box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        }
        .choose_Friend_Mzone {
            margin-left: 20px;
            width: 25%;
            height: 100%;
            background-color: #fff;
            box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
            border-radius: 0.3125rem;
        }
    }
</style>
