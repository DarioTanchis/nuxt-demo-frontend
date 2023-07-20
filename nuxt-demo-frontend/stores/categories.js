import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => {
    return { 
        categories:[]
    }
  },
  actions: {
    async initialise(){
      try{
        const { data, pending, error, refresh } = await useFetch("http://localhost:1337/api/categories", {
            method:"GET"
        })

        console.log("cat data",data)

        categories = data.value.data;
      }catch(err){
        console.log(err)
      }
    }
  },
})