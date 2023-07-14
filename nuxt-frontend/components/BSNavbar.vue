<template>
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd;">
        <!--<a class="navbar-brand">Navbar</a>-->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
        aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" @click="goToHome">Home<span v-if="this.isHome" class="sr-only">(current)</span></a>
                </li>
                <li v-if="isSignedIn === false" class="nav-item">
                    <a class="nav-link" @click="goToLogin">Accedi<span v-if="this.isLogin" class="sr-only">(current)</span></a>
                </li>
                <li v-if="isSignedIn === false" class="nav-item">
                    <a class="nav-link" @click="goToSignup">Registrati<span v-if="this.isSignup" class="sr-only">(current)</span></a>
                </li>
                <li v-if="this.$route.name === 'home'" class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{ this.category === '' ? 'Seleziona categoria' : this.category }}
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li v-for="c in this.categories"><a class="dropdown-item" @click="CategoryFilter($event, c.attributes.name)">{{ c.attributes.name }}</a></li>
                        <li v-if="this.category !== ''"><a class="dropdown-item" @click="CategoryFilter($event, '')"> Nessun categoria</a></li>
                    </ul>
                </li>
                <li v-if="this.isSignedIn === true" class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{ userStore.user !== undefined ? userStore.user.username : '' }}
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" @click="logout">Logout</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    
                </li>
            </ul>   
            <div class="nav-item">
                <ul class="navbar-nav mr-auto">
                    <li v-if="this.isSignedIn && this.isHome" class="nav-item"> <button type="button" class="nav-button btn btn-primary" @click="ViewOwnListings">
                        {{ searchStore.viewOwnListings === true ? 'Indietro' : 'Visualizza i tuoi annunci' }}</button></li>
                    <li v-if="this.isSignedIn" class="nav-item"> <button type="button" class="nav-button btn btn-danger" @click="InsertListing">Inserisci annuncio</button></li>
                    <li class="nav-item"> 
                        <form v-if="isHome" class="form-inline">
                            <ul class="navbar-nav mr-auto">
                                <li class="nav-item"><input v-model="searchString" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></li>
                                <li class="nav-item"><button class="btn btn-outline-success" type="submit" @click="this.Search">Cerca</button></li>
                            </ul>
                        </form>    
                    </li>
                </ul>
            </div>
            
        </div>
    </nav>
</template>

<script>
    import router from '@/router';
    import { useUserStore } from "@/stores/user";
    import { useSearchStore } from '@/stores/search';
    import { useCategoriesStore } from '@/stores/categories'

    export default{
        name:"BSNavbar",
        data(){
            return{
                categories: Array,
                userStore: useUserStore(),
                isHome: Boolean,
                isLogin: Boolean,
                isSignup: Boolean,
                isInsertListing: Boolean,
                searchString:'',
                category:'',
                searchStore:useSearchStore(),
                isSignedIn: false
            }
        },
        watch: {
            '$route': function (from, to) {
                if(from !== to){
                    console.log("new route set");

                    this.isHome = this.$route.name === 'home';
                    this.isLogin = this.$route.name === 'login';
                    this.isSignup = this.$route.name === 'signup';
                    this.isInsertListing = this.$route.name === 'insertListing'
                    
                    this.isSignedIn = this.userStore.jwt !== undefined && this.userStore.jwt.length > 1
                }else{
                    console.log("page refresh")
                }
            }   
        },
        async created(){
            this.categories = await this.fetchCategories();
            
            useCategoriesStore().$patch( {categories: this.categories} )

            this.searchString = this.searchStore.search;
            this.category = this.searchStore.category;
        },
        methods:{
            async fetchCategories(){
                const res = await fetch("http://localhost:1337/api/categories")

                const data = await res.json();

                return data.data;
            },
            goToLogin(e){
                e.preventDefault();

                router.push({name:'login'});
            },
            goToSignup(e){
                e.preventDefault();
                
                router.push({name:'signup'})

                console.log("go to signup")
            },
            goToHome(e){
                e.preventDefault();
                
                router.push({name:'home'})

                console.log("go to home")
            },
            logout(e){
                e.preventDefault();

                this.isSignedIn = false

                this.userStore.Logout();
            },
            Search(e){
                e.preventDefault();

                this.searchStore.setSearch(this.searchString)
            },
            CategoryFilter(e, cat){
                e.preventDefault();

                this.category = cat

                this.searchStore.setCat(cat);
            },
            InsertListing(e){
                e.preventDefault();

                this.$router.push( { name:"insertListing" } )
            },
            ViewOwnListings(e){
                e.preventDefault();

                this.searchStore.setViewOwnListings();
            }
        },
    }
</script>

<style>
    .nav-item{
        margin: 0 0 0 .5rem;
    }
</style>