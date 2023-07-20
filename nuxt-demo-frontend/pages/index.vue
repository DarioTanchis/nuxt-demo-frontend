<template>
    <div>
        <BSNavbar/>
        <main>
            <ClientOnly>
                <Listings v-bind:listingsData="listings"/>
            </ClientOnly>
        </main>
    </div>
</template>
  
<script setup>
import axios from 'axios';
    const searchStore = useSearchStore();
    //const userStore = useUserStore()

    onMounted(() => {
        useUserStore().initialise();
        useSearchStore().initialise();

        jwt = useUserStore().jwt;

        console.log("stored jwt", jwt)
    })

    let jwt = "";

    const listings = ref([]);

    listings.value = await filterListings()

    watch(searchStore, async () => {
        listings.value = await filterListings()
    })

    async function getListings(){
        try{
            console.log(`Bearer ${useUserStore().jwt}`)
            const res = await axios.get("http://localhost:1337/api/listings?populate=images,category,madeby", 
                { headers: { Authorization: "Bearer " + useUserStore().jwt } })


            return res.data.data;

        }
        catch(err){
            console.log(err)
        }        
    };

    async function filterListings(){
        const ls = await getListings();

        const userStore = useUserStore();

        const state = useSearchStore();

        console.log(ls)

        const filtered = ls.filter( l => state === undefined || (
            (state.search === undefined || state.search === '' || l.attributes.title.includes(state.search)) && 
            (state.category === '' || l.attributes.category.data.attributes.name === state.category) &&
            (state.viewOwnListings === false ? (l.attributes.madeby == null || l.attributes.madeby.data == null || l.attributes.madeby.data.id !== userStore.user.id) : 
        l.attributes.madeby == null || l.attributes.madeby.data !== null && l.attributes.madeby.data.id === userStore.user.id)))

        console.log("filtered listings", filtered)

        return filtered;
    };
</script>
