<template>
    <div v-if="!logged && currentRouteName==='home'" class="topbar">
        <RouterLink to="/login">Accedi</RouterLink>
        <RouterLink to="/signup">Registrati</RouterLink>
    </div>
    <div v-else class="topbar">
        <RouterLink to="/">Home</RouterLink>
    </div>
</template>

<script>
    import { RouterLink } from 'vue-router';
    
    export default{
        name: "TopBar",
        components: {
            RouterLink,
        },
        props: {
            logged:Boolean
        },
        computed: {
            currentRouteName() {
                return this.$route.name;
            }
        }
    }
</script>

<style scoped>
    .topbar{
        margin-top: 20px;

        height: 50px;
        width: 100%;

        font-size: 15px;
    }

    .topbar > * {
        margin: 20px;
        margin-top: 40px;
        text-decoration: none;
    }
</style>