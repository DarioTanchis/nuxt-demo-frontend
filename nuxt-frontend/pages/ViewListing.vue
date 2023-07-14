<template>
    <main>
        <div class="container align-items-start">
            <div class="card" style="width: 40rem;">
                <img class="card-img-top" v-if="this.listing.images === undefined || this.listing.images.data === null"
                src="https://italiancinemaaudiences.org/wp-content/themes/trend/assets/img/empty/424x500.png" style="max-height: 30rem; white-space:nowrap" alt="Card image cap">
                <div v-else id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                    <div v-for="(img, index) in this.listing.images.data" class="carousel-inner">
                        <div class="carousel-item" :class=" index === this.index ? 'active' : ''">
                            <img class="d-block card-img-top" style="max-height: 45rem;" :src="'http://localhost:1337'+img.attributes.url">
                        </div>
                    </div>
                    <a v-if="this.listing.images.data.length > 1" class="carousel-control-prev" @click="prevImage" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    {{ console.log(this.listing.images.data.length) }}
                    <a v-if="this.listing.images.data.length > 1" class="carousel-control-next" @click="nextImage" role="button" data-slide="next">
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

                        <h4 class="mt-3" v-if="this.listing.email !== null || this.listing.phone !== null">Contatti</h4>
                        <div class="row ">
                            <div v-if="this.listing.email" class="col-md-auto">
                                {{ this.listing.email }}
                            </div>
                            <div class="col-md-auto">
                                <div class="vr">

                                </div>
                            </div>
                            <div v-if="this.listing.phone" class="col-md-auto">
                                {{ this.listing.phone }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
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
</script>

<style>
    .card {
            margin: 0 auto; /* Added */
            float: none; /* Added */
            margin-bottom: 10px; /* Added */
            margin-top: 5rem;
    }

</style>