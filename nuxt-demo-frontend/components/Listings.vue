<template>
    <div class="album py-5 bg-body-tertiary">
        <div class="container text-center">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 align-items-start">
                <ListingPreview v-for="l in listingsData" v-bind:listing="l"/>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        listingsData: Array
    })
</script>


<style scoped>
    .listings{
        width: 80%;
        margin: auto;

        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
    
        margin-bottom: 200px;
    }
</style>
