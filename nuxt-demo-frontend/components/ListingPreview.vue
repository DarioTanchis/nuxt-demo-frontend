<template>
    <div class="col">
        <div @click="viewListing($event, listing)" class="card shadow-sm">
            <img class="bd-placeholder-img card-img-top"  v-if="listing.attributes.images === undefined || listing.attributes.images.data === null"
             src="https://italiancinemaaudiences.org/wp-content/themes/trend/assets/img/empty/424x500.png" width="100%" height="225" xmlns="" role="img" aria-label="Placeholder: Thumbnail" 
             preserveAspectRatio="xMidYMid slice" focusable="true">
             <img class="bd-placeholder-img card-img-top"  v-else :src="'http://localhost:1337' + listing.attributes.images.data[0].attributes.url"  width="100%" height="225" 
             xmlns="" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="true">
            <rect width="100%" height="100%" fill="#55595c"></rect>
            <div class="card-body">
                <p class="card-text">{{ listing.attributes.title }}</p>
            </div>
        </div>
    </div>
        
</template>

<script setup>
    const props = defineProps({
        listing:Object
    })

    async function viewListing(e, listing){
        e.preventDefault();

        console.log("listing:", listing)

        return await navigateTo({ path:'/listing/'+listing.id})
    }    
</script>

<style>
    .listing{
        display: flex;
        flex-direction: column;
        padding: 20px;

        width: 300px;
        height: 300px;

        margin: 15px;
        margin-top: 30px;
        border-radius: 15px;

        box-shadow: lightgray 1px 1px 3px 2px;
    }

    .listing > *{
        padding: 3px;
        text-align: center;

        margin: 5px;
        margin-top: 15px;
    }

    .thumbnail{
        max-height: 150px;
        width: auto;
        
        border-radius: 10px;

        margin: auto;
    }
</style>