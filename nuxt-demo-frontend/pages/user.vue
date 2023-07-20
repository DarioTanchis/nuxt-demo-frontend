<template>
    <BSNavbar/>
     <div class="album py-5 bg-body-tertiary">
        <div class="container text-center">
            <div class="card shadow-sm" style="margin-top: 2rem; max-width: 45rem; margin-left: auto; margin-right: auto; padding: 1rem;">
                <ClientOnly>
                    <div v-for="(l,i) in listings" >
                        <div class="hstack gap-5" @click="viewListing($event, l)">
                            {{ console.log("attr",l.attributes) }}
                            <div v-if="l.attributes.images.data !== null"> <img :src="'http://localhost:1337' + l.attributes.images.data[0].attributes.url" 
                                style="max-width: 5rem; max-height: 4rem; border-radius: .5rem;"></div>
                            <div v-else><img src="https://italiancinemaaudiences.org/wp-content/themes/trend/assets/img/empty/424x500.png" 
                                style="max-width: 5rem; max-height: 4rem; border-radius: .5rem;"></div>
                            <div>{{ l.attributes.title }}</div>
                            <div>{{ l.attributes.price === 0 ? 'Gratis' : l.attributes.price }}</div>
                            <div><button class="btn btn-danger" @click="deleteListing($event, l.id)">Elimina</button></div>
                        </div>
                        <hr v-if="i < listings.length - 1">
                    </div>
                    <div v-if="listings.length === 0">
                        Non hai ancora inserito alcun annuncio
                    </div>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios';

    const listings = ref( [] )

    onMounted( async () => {
        useUserStore().initialise();

        listings.value = await getListings();

        console.log("listings", listings)
    } )

    async function getListings(){
        try{
            console.log(`Bearer ${useUserStore().jwt}`)
            const res = await axios.get("http://localhost:1337/api/listings?populate=images,category,madeby", 
                { headers: { Authorization: "Bearer " + useUserStore().jwt } });

            console.log(res)

            const arr = res.data.data;
            console.log(useUserStore().user.id)
            
            return arr.filter( (l) => l.attributes.madeby.data !== null && l.attributes.madeby.data.id === useUserStore().user.id );
        }
        catch(err){
            console.log(err)
        }        
    };

    async function deleteListing(e, id){
        e.preventDefault();
        
        try{
            const res = await axios.delete(`http://localhost:1337/api/listings/${id}`, 
            { 
                headers: { Authorization: "Bearer " + useUserStore().jwt } 
            });

            listings.value = listings.value.filter( (l) => l.id !== id );

            console.log("listings after delete", listings.value)
        }
        catch(err){
            alert("errore")
        }
    }

    async function viewListing(e, listing){
        if(e.originalTarget.tagName === 'DIV'){ //Visualizza l'annuncio se non si è cliccato sul tasto elimina
            e.preventDefault();

            return await navigateTo({ path:'/listing/'+listing.id})
        }
    }    
</script>