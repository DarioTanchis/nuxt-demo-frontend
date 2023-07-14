<template>
    <div>
        <BSNavbar/>
        <main>
            {{ console.log("listings data in home", listings) }}
            <Listings v-bind:listingsData="listings"/>
        </main>
    </div>
    <NuxtPage/> 
</template>
  
<script setup>
    import BSNavbar from '~/components/BSNavbar.vue';
    import { useSearchStore } from '@/stores/search';
    import { useUserStore } from '@/stores/user'
    import axios from 'axios';

    const searchStore = useSearchStore();
    const userStore = useUserStore()

    const jwt = userStore.jwt;
    console.log("jwt",userStore.jwt)

    const listings = await getListings();
    console.log("listings", listings)

    async function getListings(){
        //const res = await fetch("http://localhost:1337/api/listings?populate=images,category,madeby")
        const res = await axios.get("http://127.0.0.1:1337/api/listings?populate=images,category,madeby")

        //const response = await res.json();

        return res.data.data;
    };

    async function filterListings(state){
        const ls = await getListings();
        console.log("listings before filter: ", ls)

        console.log(userStore.user.id)

        listings = ls.filter( l => state === undefined || (l.attributes.title.includes(state.search) && 
        (state.category === '' || l.attributes.category.data.attributes.name === state.category) &&
        (state.viewOwnListings === false ? l.attributes.madeby.data.id !== userStore.user.id : l.attributes.madeby.data.id === userStore.user.id)))

        console.log("listings after filter", listings)
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
