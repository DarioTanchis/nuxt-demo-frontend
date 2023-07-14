<template>
    <div id="background">
        <section class="vh-100" id = "mysection">
            <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-xl-10">
                <div class="card" style="border-radius: 1rem;">
                <div class="row g-0">
                    <div class="col-md-6 col-lg-5 d-none d-md-block">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                        alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem;" />
                    </div>
                    <div class="col-md-6 col-lg-7 d-flex align-items-center">
                    <div class="card-body p-4 p-lg-5 text-black">

                        <form>

                        <div class="d-flex align-items-center mb-3 pb-1">
                            <i class="fas fa-cubes fa-2x me-3" style="color: #ff6219;"></i>
                            <span class="h1 fw-bold mb-0">Logo</span>
                        </div>

                        <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Accedi al tuo account</h5>

                        <div class="form-outline mb-4">
                            <label class="form-label" for="identifierInput">Username/Email</label>
                            <input type="text" id="identifierInput" class="form-control form-control-lg" 
                            v-model="this.identifier"/>
                        </div>

                        <div class="form-outline mb-4">
                            <label class="form-label" for="passwordInput">Password</label>
                            <input type="password" id="passwordInput" class="form-control form-control-lg" 
                            v-model="this.password"/>
                        </div>

                        <div class="pt-1 mb-4">
                            <button class="btn btn-dark btn-lg btn-block" type="button" @click="login">Accedi</button>
                        </div>

                        <!--<a class="small text-muted" href="#!">Forgot password?</a>-->  
                        <p class="mb-5 pb-lg-2" style="color: #393f81;">Non sei registrato? <a @click="goToSignup"
                            style="color: #393f81;">Registrati</a></p>
                        </form>

                        </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>
        </section>
    </div>
</template>

<script>
    import router from '@/router'
    import { RouterLink } from 'vue-router';
    import { useUserStore } from '@/stores/user'

    //per login vuole solo email (o nome utente credo) e psw
    export default{
    name: "Login",
    data() {
        return {
            identifier: "", //username or email
            password: "",
        };
    },
    methods: {
        async login(e) {
            e.preventDefault();
            
            try{
                const res = await this.axios.post(`http://localhost:1337/api/auth/local`, {
                    "identifier": this.identifier,
                    "password": this.password
                });

                console.log("user data: ",res.data)

                const { jwt, user } = res.data

                const userStore = useUserStore()

                userStore.setUser(jwt, user)

                router.push({
                    name: "home",
                });
            }
            catch(err){
                console.log(err)

                alert("Login non riuscito");
            }
        },
        goToSignup(e){
            e.preventDefault();

            router.push({ name: "signup" })
        }
    },
    components: { RouterLink }
}
</script>

<style>
#background{
    background-color:cornflowerblue;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-bottom: 10rem;
}

#mycard{
    width: 10rem;
}
</style>