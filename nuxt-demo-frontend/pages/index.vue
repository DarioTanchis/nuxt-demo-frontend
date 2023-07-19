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
    const listingsStore = useListingsStore();
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

    watch(searchStore, async () => {
        listings.value = await filterListings()
    })

    async function getListings(){
        try{
            //const res = await fetch("http://localhost:1337/api/listings?populate=images,category,madeby")
            const { data, pending, error, refresh } = await useFetch("http://127.0.0.1:1337/api/listings?populate=images,category,madeby")

            //const response = await res.json();

            return data._value.data;
        }
        catch(err){
            console.log(err)
        }        
    };

    async function filterListings(){
        const ls = await getListings();

        const userStore = useUserStore();

        const state = useSearchStore();

        const filtered = ls.filter( l => state === undefined || (
            (state.search === undefined || l.attributes.title.includes(state.search)) && 
            (state.category === '' || l.attributes.category.data.attributes.name === state.category) &&
            (state.viewOwnListings === false ? l.attributes.madeby === undefined || l.attributes.madeby.data.id !== userStore.user.id : 
        l.attributes.madeby === undefined || l.attributes.madeby.data.id === userStore.user.id)))

        return filtered;
    };
</script>

<!--
    <script>
    import Listings from "@/components/Listings"
    import { useSearchStore } from "@/stores/search"
    import { useUserStore } from "@/stores/user"

    export default{
        name: 'Home',
        components:{
            Listings,
        },
        data(){
            return{
                jwt:'',
                listings: [],
                searchStore: useSearchStore(),
                userStore: useUserStore()
            }
        },
        async created(){
            try{
                this.jwt = this.userStore.jwt;
            }
            catch(err){
                console.log(err)
            }
        
            await this.filterListings(this.searchStore);

            console.log(this.searchStore)
            console.log("user store", this.userStore.user)

            await this.searchStore.$subscribe(async (mutation, state) => {
                console.log("search state change")
                await this.filterListings(state)
            })
        
        },
        methods:{
            async getListings(){
                //const res = await fetch("http://localhost:1337/api/listings?populate=images,category,madeby")
                const res = await this.axios.get("http://localhost:1337/api/listings?populate=images,category,madeby", 
                { headers: { Authorization: "Bearer " + this.userStore.jwt } })

                //const response = await res.json();

                console.log(res)

                return res.data.data;
            },
            async filterListings(state){
                const ls = await this.getListings();
                console.log("listings before filter: ", ls)

                console.log(this.userStore.user.id)

                this.listings = ls.filter( l => state === undefined || (l.attributes.title.includes(state.search) && 
                (state.category === '' || l.attributes.category.data.attributes.name === state.category) &&
                (state.viewOwnListings === false ? l.attributes.madeby.data.id !== this.userStore.user.id : l.attributes.madeby.data.id === this.userStore.user.id)))

                console.log("listings after filter", this.listings)
            },
        },
    }
    
</script>
-->
