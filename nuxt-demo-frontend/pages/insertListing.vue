<template>
    <BSNavbar/>
    <main>
        <div class="container align-items-start">
            <div class="card" style="width: 50rem; margin-top: 2rem; margin-left: auto; margin-right: auto;">
                <div v-if="isLogged" class="card-body">
                    <form style="">
                        <div class="form-group mb-3">
                            <label for="formTitle" class="form-label">Titolo</label>
                            <input v-model="title" aria-describedby="titleFeedback" :class="this.submitted ? (this.titleError ? 'is-invalid' : 'is-valid'):''" 
                                class="form-control" type="text" id="formTitle" multiple>
                            <div id="titleFeedback" class="invalid-feedback">
                                Il titolo non può essere vuoto e deve avere minimo 2 caratteri
                            </div>
                        </div>

                        <div v-if="this.images !== undefined && this.images.length > 0" 
                            id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                            <div v-for="(img, index) in this.imagesUrls" class="carousel-inner">
                                <div class="carousel-item" :class=" index === this.imageIndex ? 'active' : ''">
                                    <img class="d-block card-img-top" :src="img">
                                </div>
                            </div>
                            <a v-if="this.imagesUrls.length > 1" class="carousel-control-prev" @click="prevImage" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a v-if="this.imagesUrls.length > 1" class="carousel-control-next" @click="nextImage" role="button" data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                        <div class="form-group mb-3">
                            <label for="formFileMultiple" class="form-label">Foto</label>
                            <input class="form-control" type="file"  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                            id="formFileMultiple" @change="setImages" multiple>
                        </div>

                        <div class="form-group mb-3 dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="catDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{ this.category === '' ? 'Seleziona Categoria' : this.category }}
                            </button>
                            <ul class="dropdown-menu" :class="this.submitted ? (this.catError ? 'is-invalid' : 'is-valid'):''" 
                                aria-describedby="categoriesFeedback" aria-labelledby="catDropdown">
                                <li v-for="c in this.categoriesStore.categories"><a class="dropdown-item" @click="setCat($event, c.attributes.name)">{{ c.attributes.name }}</a></li>
                            </ul>
                            <div id="categoriesFeedback" class="invalid-feedback">
                                Devi selezionare una categoria
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="formDescription">Descrizione</label> 
                            <textarea :class="this.submitted ? (this.descriptionError ? 'is-invalid' : 'is-valid'):''" class="form-control" type="text"
                             id="formDescription" rows="8" v-model="description" multiple></textarea>
                            <div id="descriptionFeedback" class="invalid-feedback">
                                La descrizione non può essere vuota e deve contenere almeno 5 caratteri.
                            </div>
                        </div>
                        <div class="form-group mb-3">
                            <label for="formPhone" class="form-label">Numero di Telefono</label>
                            <input v-model="phone" class="form-control" type="text" id="formPhone" multiple>
                        </div>
                        <div class="form-group mb-3">
                            <label for="formEmail" class="form-label">Email</label>
                            <input v-model="email" class="form-control" type="email" id="formEmail" multiple>
                        </div>
                        <div class="form-group mb-3">
                            <label for="formPrice" class="form-label">Prezzo</label>
                            <input v-model="price" class="form-control" type="number" id="formPrice" min="0" max="500000000" multiple>
                        </div>
                        <div class="form-group" style="padding-top: 1rem;">
                            <button type="submit" class="btn btn-primary"  @click="submit">Inserisci</button>
                        </div>
                    </form>
                </div>
                <div class="card-body" v-else>
                    <h2 style="color: red;">Non puoi pubblicare un annuncio a meno che tu non sia autenticato</h2>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    export default{
        name: "Insert Listing",
        data(){
            return{
                imageIndex:0,
                title:'',
                description:'',
                price:0,
                phone:'',
                email:'',
                imagesUrls:[],
                category:'',
                images:[],
                categoriesStore: Object,
                isLogged: false,
                catError: false,
                titleError: false,
                descriptionError: false,
                priceError: false,
                submitted: false
            }
        },
        created(){
            this.categoriesStore = useCategoriesStore();
            this.categoriesStore.initialise();


            this.isLogged = useUserStore().jwt !== null && useUserStore().jwt !== undefined && useUserStore().jwt !== '';
        },
        methods: {
            nextImage(e){
                e.preventDefault();

                const carouselItems = document.getElementsByClassName("carousel-item");

                this.imageIndex = (this.imageIndex + 1) % carouselItems.length;
            },
            prevImage(e){
                e.preventDefault();

                const carouselItems = document.getElementsByClassName("carousel-item");

                this.imageIndex = (this.imageIndex - 1) % carouselItems.length;
                if(this.imageIndex  < 0)
                    this.imageIndex = carouselItems.length - 1;
            },
            setImages(e){
                e.preventDefault();

                let images = Array.from(e.target.files);

                images = images.filter( f => f['type'] === 'image/jpeg' || f['type'] === 'image/png' )  //filters file that are not images

                this.imagesUrls = []
                
                if (images) {
                    Array.prototype.forEach.call(images, this.readAndPreview);
                }
                
                this.images = images
            },
            async submit(e){
                e.preventDefault();

                let jsonImages = [];

                this.submitted = true;

                if(this.images.length > 0){
                    const formData = new FormData();
                
                    this.images.forEach(img => {
                        formData.append(`files`, img)
                    })

                    try{
                        const { data, pending, error, refresh } = await useFetch("http://localhost:1337/api/upload", { method:"POST", body:formData })
      
                        console.log(data)

                        this.images = []
                        data.value.forEach( (el) => this.images.push(el.id) )

                        this.images.forEach( (img) => jsonImages.push({ id:img }))
                    }catch(err){
                        console.log("Something wrong in image upload");
                        console.log(err)
                    }
                }

                this.catError = false;
                let catId;
                try{
                    catId = this.categoriesStore.categories.filter( (el) => el.attributes.name === this.category )[0].id
                }catch(err){
                    catId = -1
                    this.catError = true;
                }

                const userId = useUserStore().user.id
                console.log("user id",userId)

                const { data, pending, error, refresh } = await useFetch("http://localhost:1337/api/listings", 
                {
                    method: "POST",
                    body:{
                        data:{
                            title: this.title,
                            description: this.description,
                            email: this.email,
                            phone: this.phone,
                            price: this.price,
                            images: jsonImages,
                            category: catId,
                            madeby: userId,
                            }
                    },
                    headers:{               
                        Authorization:
                        `Bearer ${useUserStore().jwt}`
                    }
                });

                if(error.value !== null){
                    alert("Errore nell'inserimento dell'annuncio")
                    
                    //title, description, price
                    const errors = error.value.data.error.details.errors;

                    this.titleError = false;
                    this.descriptionError = false;
                    this.priceError = false;

                    console.log(errors)
                    errors.forEach( (err) => {
                        this.titleError = this.titleError || err.message.includes('title');
                        this.descriptionError = this.descriptionError || err.message.includes('description');
                        this.priceError = this.priceError || err.message.includes('price');
                    } )

                    console.log("errors", this.titleError, this.descriptionError, this.priceError)
                }else{
                    console.log(data)
                    console.log("listing id", data.value.data.id)

                    if(!alert("Annuncio inserito correttamente")){
                        navigateTo({path:`/listing/${data.value.data.id}`})
                    }
                }
            },
            readAndPreview(file) {
                // Make sure `file.name` matches our extensions criteria
                const reader = new FileReader();

                reader.addEventListener(
                    "load",
                    () => {
                        this.imagesUrls.push(reader.result)
                    },
                    false,
                );

                reader.readAsDataURL(file);
            },
            setCat(e, cat){
                e.preventDefault();

                this.category = cat;
            },
            
        }
    }
</script>
