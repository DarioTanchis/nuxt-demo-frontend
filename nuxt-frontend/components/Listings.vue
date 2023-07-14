<template>
    <div class="album py-5 bg-body-tertiary">

        <div class="container text-center">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 align-items-start">
                {{ console.log("listings in Listings.vue", this.listingsData) }}
                <ListingPreview v-for="l in this.listingsData" v-bind:listing="l"/>
            </div>
        </div>
    </div>
    <!--
<div class="listings">
        <ListingPreview v-for="l in this.listingsData" v-bind:listing="l"/>
    </div>
    -->
    
</template>

<script>
    import ListingPreview from "@/components/ListingPreview.vue";
    import { RouterLink } from "vue-router";
    
    export default{
        name: "Listings",
        props:{
            listingsData: Array,
        },
        components:{
            ListingPreview,
            RouterLink
        }
    }
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