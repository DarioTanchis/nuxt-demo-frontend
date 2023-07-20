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
                    <a class="nav-link" @click="goToHome">Home<span v-if="isHome" class="sr-only">(current)</span></a>
                </li>
                <ClientOnly>
                    <li v-if="userStore.loggedIn === false" class="nav-item">
                        <a class="nav-link" @click="goToLogin">Accedi<span v-if="isLogin" class="sr-only">(current)</span></a>
                    </li>
                    <li v-if="userStore.loggedIn === false" class="nav-item">
                        <a class="nav-link" @click="goToSignup">Registrati<span v-if="isSignup" class="sr-only">(current)</span></a>
                    </li>
                    <li v-if="isHome" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ category === '' ? 'Seleziona categoria' : category }}
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li v-for="c in categories"><a class="dropdown-item" @click="CategoryFilter($event, c.attributes.name)">{{ c.attributes.name }}</a></li>
                            <li v-if="category !== ''"><a class="dropdown-item" @click="CategoryFilter($event, '')"> Nessun categoria</a></li>
                        </ul>
                    </li>
                    <li v-if="userStore.loggedIn" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ userStore.user !== undefined ? userStore.user.username : '' }}
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item" @click="ViewOwnListings">Visualizza i tuoi annunci</a></li>
                            <li><a class="dropdown-item" @click="logout">Logout</a></li>
                        </ul>
                    </li>
                </ClientOnly>
            </ul>   
            <div class="nav-item" style="margin-right: 1rem;">
                <ul class="navbar-nav mr-auto">

                        <ClientOnly>
                            <li v-if="userStore.loggedIn && isInsertListing === false" class="nav-item"> 
                                <button type="button" class="nav-button btn btn-danger" @click="InsertListing">Inserisci annuncio</button>
                            </li>
                        </ClientOnly>
                        
                    <li class="nav-item"> 
                        <ClientOnly>
                            <form v-if="isHome" class="form-inline">
                                <ul class="navbar-nav mr-auto">
                                    <li class="nav-item"><input v-model="searchString" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></li>
                                    <li class="nav-item"><button class="btn btn-outline-success" type="submit" @click="Search">Cerca</button></li>
                                </ul>
                            </form>  
                        </ClientOnly>
                    </li>
                </ul>
            </div> 
        </div>
    </nav>
</template>

<script setup>
    let userStore = null;
    let searchStore = null;

    let isHome = false;
    const categories = await fetchCategories();
    let isLogin = false
    let isSignup = false
    let isInsertListing = false 
    let searchString = null
    let category = null

    const route = useRoute()


    isHome = route.path === '/';
    isLogin = route.path === '/login';
    isSignup = route.path === '/signup';
    isInsertListing = route.path === '/insertListing'

    onMounted( () => {
        userStore = useUserStore();
        searchStore = useSearchStore();

        userStore.initialise();
        searchStore.initialise();

        searchString = searchStore.search
        category = ref(searchStore.category)
    });

    async function fetchCategories(){
        try{
            const { data, pending, error, refresh } = await useFetch("http://localhost:1337/api/categories", {
                method:"GET"
            })

            console.log("cat data",data)

            useCategoriesStore().$patch({ categories:data.value.data })

            return data.value.data;
        }catch(err){
            console.log(err)

            return null;
        }
        
    };

    async function goToLogin(e){
        e.preventDefault();

        await navigateTo({ path: '/login' })
    };

    async function goToSignup(e){
        e.preventDefault();
        
        await navigateTo({ path: '/signup' })

        console.log("go to signup")
    };

    async function goToHome(e){
        e.preventDefault();

        await navigateTo({ path: '/' })

        console.log("go to home")
    };

    async function logout(e){
        e.preventDefault();

        userStore.Logout();

        await navigateTo({ path: '/' })
    };

    function Search(e){
        e.preventDefault();

        console.log(searchString)

        searchStore.setSearch(searchString)
    };

    function CategoryFilter(e, cat){
        e.preventDefault();

        console.log(cat)

        category.value = cat

        searchStore.setCat(cat);
    };

    async function InsertListing(e){
        e.preventDefault();

        await navigateTo({ path: '/insertListing' })
    };

    async function ViewOwnListings(e){
        e.preventDefault();

        await navigateTo({ path: `/user` })
    };
</script>

<style>
    .nav-item{
        margin: 0 0 0 .5rem;
    }
</style>