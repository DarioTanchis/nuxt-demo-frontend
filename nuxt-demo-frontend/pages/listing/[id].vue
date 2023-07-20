<template>
    <BSNavbar/>
    <main>
        <div class="container align-items-start">
            <div class="card" style="width: 40rem; margin-right: auto; margin-left: auto; margin-top: 2rem; margin-bottom: 2rem;">
                <img class="card-img-top" v-if="listing.images === undefined || listing.images.data === null"
                src="https://italiancinemaaudiences.org/wp-content/themes/trend/assets/img/empty/424x500.png" style="max-height: 30rem; white-space:nowrap" alt="Card image cap">
                <div v-else id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                    <div v-for="(img, i) in listing.images.data" class="carousel-inner">
                        <div class="carousel-item" :class="i === index ? 'active' : ''">
                            <img class="d-block card-img-top" style="max-height: 45rem;" :src="'http://localhost:1337'+img.attributes.url">
                        </div>
                    </div>
                    <a v-if="listing.images.data.length > 1" class="carousel-control-prev" @click="prevImage" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a v-if="listing.images.data.length > 1" class="carousel-control-next" @click="nextImage" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
                <div class="card-body">

                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <h2 class="align-text-bottom">{{ listing.title }}</h2>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <h5 class="align-text-bottom">{{ listing.price === 0 ? 'Gratis' : listing.price + '€' }}</h5>
                            </div>
                        </div>

                        <h5 class="mt-3">Descrizione</h5>
                        <p class="card-text">{{ listing.description }}</p>

                        <h4 class="mt-3" v-if="listing.email !== null && listing.email !== '' || listing.phone !== null && listing.phone !== ''">Contatti</h4>
                        <div class="row ">
                            <div v-if="listing.email" class="col-md-auto">
                                {{ listing.email }}
                            </div>
                            <div v-if="listing.email && listing.phone" class="col-md-auto">
                                <div class="vr"></div>
                            </div>
                            <div v-if="listing.phone" class="col-md-auto">
                                {{ listing.phone }}
                            </div>
                        </div>
                        <ClientOnly>
                            <div v-if="listing.madeby !== undefined && listing.madeby.data !== undefined 
                            && listing.madeby.data !== null && listing.madeby !== ''" class="row">
                                <div class="col-md-auto">
                                    {{ console.log("madeby", listing.madeby) }}
                                    <h6>Pubblicato da {{ listing.madeby.data.attributes.username }}</h6>
                                </div>
                            </div>
                            <div class="row" v-if="listing.madeby !== undefined && listing.madeby.data.id === userStore.user.id">
                                <div class="col-md-auto" style="padding-top: 2rem;">
                                    <div class=" hstack gap-3">
                                        <button class="btn btn-primary" @click="editListing($event, l.id)">Modifica</button>
                                        <button class="btn btn-danger" @click="deleteListing($event, l.id)">Elimina</button>
                                    </div>
                                </div>
                            </div>

                        </ClientOnly>
                    </div>
                </div>
            </div>
        </div>  
    </main>
</template>

<script setup>
    const route = useRoute();

    console.log(route.params)
    const { id } = route.params;
    const index = ref(0);

    let userStore = null;

    let listing = await fetchListing();

    onMounted( async () => {
        userStore = useUserStore();

        userStore.initialise();
    });

    async function fetchListing(){
        const { data, pending, error, refresh } = await useFetch("http://127.0.0.1:1337/api/listings/"+route.params.id+"?populate=images,madeby")

        console.log("listing data",data)

        return data.value.data.attributes;
    };

    function nextImage(e){
        e.preventDefault();

        const carouselItems = document.getElementsByClassName("carousel-item");

        index.value = (index.value + 1) % carouselItems.length;

        console.log(index.value)
    };
    function prevImage(e){
        e.preventDefault();

        const carouselItems = document.getElementsByClassName("carousel-item");

        index.value = (index.value - 1) % carouselItems.length;

        if(index.value  < 0)
            index.value = carouselItems.length - 1;

        console.log(index.value)
    };

    /*
    export default{
        name: "ViewListing",
        data(){
            return{
                listing:Object,
                index:0
            }
        },
        methods:{
            async fetchListing(){
                const res = await fetch("http://localhost:1337/api/listings/"+this.$route.params.id+"?populate=images" )

                const data = await res.json();

                this.listing = data.data.attributes;

                console.log(this.listing)
            },
            nextImage(e){
                e.preventDefault();

                const carouselItems = document.getElementsByClassName("carousel-item");

                this.index = (this.index + 1) % carouselItems.length;
            },
            prevImage(e){
                e.preventDefault();

                const carouselItems = document.getElementsByClassName("carousel-item");

                this.index = (this.index - 1) % carouselItems.length;

                if(this.index  < 0)
                    this.index = carouselItems.length - 1;
            }
        },
        async created(){
            const res = await this.fetchListing();
        },
    }
    */
</script>