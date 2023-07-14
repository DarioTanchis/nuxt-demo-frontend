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

                        <form :class="this.submitted ? 'was-validated':''">

                        <div class="d-flex align-items-center mb-3 pb-1">
                            <i class="fas fa-cubes fa-2x me-3" style="color: #ff6219;"></i>
                            <span class="h1 fw-bold mb-0">Logo</span>
                        </div>

                        <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Creazione account</h5>

                        <div class="form-outline mb-4">
                            <label class="form-label" for="nameInput">Nome</label>
                            <input type="text" id="nameInput" aria-describedby="nameFeedback" class="form-control form-control-lg" 
                            :class="this.submitted ? (this.name.length === 0 ? 'is-invalid' : 'is-valid') : ''" v-model="this.name"/>
                            <div id="nameFeedback" class="invalid-feedback">
                                Il campo non può essere vuoto.
                            </div>
                        </div>

                        <div v-if="alreadyTakenError" id="usernameEmailError">
                            Username o email già registrati
                        </div>
                        <div class="form-outline mb-4">
                            <label class="form-label" for="usernameInput">Username</label>
                            <input type="text" id="usernameInput" aria-describedby="usernameFeedback" class="form-control form-control-lg" 
                            :class="this.submitted ? (this.usernameError === true || this.alreadyTakenError === true ? 'is-invalid' : 'is-valid') : '' " v-model="this.username"/>
                            <div id="usernameFeedback" class="invalid-feedback">
                                Username già registrato o formato scorretto.
                            </div>
                        </div>

                        <div class="form-outline mb-4">
                            <label class="form-label" for="emailInput">Email</label>
                            <input type="" id="emailInput" aria-describedby="emailFeedback" class="form-control form-control-lg" 
                            :class="this.submitted ? (this.emailError === true || this.alreadyTakenError === true ? 'is-invalid' : 'is-valid') : ''" v-model="this.email"/>
                            <div id="emailFeedback" class="invalid-feedback">
                                Email già registrata o formato scorretto.
                            </div>
                        </div>

                        <div class="form-outline mb-4">
                            <label class="form-label" for="passwordInput">Password</label>
                            <input type="password" id="passwordInput" aria-describedby="passwordFeedback" class="form-control form-control-lg" 
                            :class="this.submitted ? (this.passwordError === true ? 'is-invalid' : 'is-valid'):''" v-model="this.password"/>
                            <div id="passwordFeedback" class="invalid-feedback">
                                La password non rispetta i requisiti.
                            </div>
                        </div>

                        <div class="pt-1 mb-4">
                            <button class="btn btn-dark btn-lg btn-block" type="button" @click="registerUser">Registrati</button>
                        </div>

                        <!--<a class="small text-muted" href="#!">Forgot password?</a>--> 
                        <p class="mb-5 pb-lg-2" style="color: #393f81;">Sei già registrato? <a @click="goToLogin"
                            style="color: #393f81;">Accedi</a></p>
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
    import router from '@/router';
    import { RouterLink } from 'vue-router';
    import { useUserStore } from '@/stores/user'

    export default{
        name:'Signup',
        data(){
            return{
                name: '',
                email: '',
                password: '',
                username: '',
                emailError: false,
                usernameError: false,
                passwordError: false,
                alreadyTakenError: false,
                submitted: false
            }
        },
        methods:{
            async registerUser(e){
                e.preventDefault();

                const user = {
                    name:this.name,
                    email:this.email,
                    password:this.password,
                    username:this.username
                }

                console.log(JSON.stringify(user));
                
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(user)
                };

                try{
                    const res = await fetch('http://localhost:1337/api/auth/local/register', requestOptions);
                    const data = await res.json()

                    if(res.ok){
                        const userStore = useUserStore();

                        userStore.$patch({ jwt: data.jwt, name: data.user.username })        

                        router.push({
                            name:"home",
                        })
                    }else{
                        alert("Errore nella registrazione")

                        if(data.error.details.error === undefined){
                            this.alreadyTakenError = data.error.message.includes('Email')

                            alert("L'username o l'email sono già utilizzati!")
                        }
                        else{
                            const errors = data.error.details.errors;

                            console.log(errors)

                            this.passwordError = false;
                            this.emailError = false;
                            this.usernameError = false;

                            console.log(errors.length)
                            for(let i = 0; i < errors.length; i++){
                                this.passwordError = this.passwordError || (errors[i].path.length > 0 && errors[i].message.includes('password')); //If the error is not set already and it is found in the path of the received errors
                                this.emailError = this.emailError || (errors[i].path.length > 0 && errors[i].message.includes('email')); 
                                this.usernameError = this.usernameError || (errors[i].path.length > 0 && errors[i].message.includes('username')); 
                            }
                        }

                        this.submitted = true;
                    }
                }
                catch(err){
                    console.log(err)
                }

            },
            goToLogin(e){
                e.preventDefault();

                router.push({ name: "login" })
            }
        }
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

#usernameEmailError{
    color: red;
    margin-bottom: 20px;
}
</style>