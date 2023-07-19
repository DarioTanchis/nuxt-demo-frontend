import { defineStore } from 'pinia'

export const useListingsStore = defineStore('listings', {
  state: () => {
    return { 
        listings:[]
    }
  },
  actions: {
    async filterListings(state){
      const ls = await this.getListings();

      console.log("listings ", ls)

      this.listings = ls.filter( l => state === undefined || state.search === '' || (l.attributes.title.includes(state.search) && 
        (state.category === '' || l.attributes.category.data.attributes.name === state.category) &&
        (state.viewOwnListings === false ? l.attributes.madeby !== undefined && l.attributes.madeby.data.id !== userStore.user.id : 
          l.attributes.madeby !== undefined && l.attributes.madeby.data.id === userStore.user.id)));

      console.log("filtered listings: ", this.listings)

      return this.listings;
    },
    async getListings(){
      try{
        //const res = await fetch("http://localhost:1337/api/listings?populate=images,category,madeby")
        const { data, pending, error, refresh } = await useFetch("http://127.0.0.1:1337/api/listings?populate=images,category,madeby")

        console.log("fetched data", data)

        //const response = await res.json();

        this.listings = data._value.data;

        return this.listings;
      }
      catch(err){
          console.log(err)
      }    
    }
  },
  getters:{

  },
})