import { defineStore, setActivePinia } from 'pinia'
import { useStorage } from '@vueuse/core';

export const useSearchStore = defineStore('search', {
  state: () => {
    return { 
        search: '',
        category: '',
        viewOwnListings: false,
    }
  },
  actions:{
    initialise(){
      const storage = useStorage('search-store',
      { search:"", category:"", viewOwnListings:false },
      localStorage,{ mergeDefaults: true })

      this.search = storage.value.search;
      this.category = storage.value.category;
      this.viewOwnListings = storage.value.viewOwnListings;

      console.log("search", this.search, this.category)
    },
    setSearch(s){
      this.search = s

      this.updateLocalStorage();
    },
    setCat(c){
      this.category = c

      this.updateLocalStorage();
    },
    setViewOwnListings(){
      console.log("view own listings",this.viewOwnListings)
      this.viewOwnListings = !this.viewOwnListings;

      console.log("view own listings",this.viewOwnListings)

      this.updateLocalStorage();
    },
    updateLocalStorage(){
      localStorage.setItem('search-store', `{"search":"${this.search}", "category":"${this.category}", "viewOwnListings":${this.viewOwnListings}}`)
    }
  }
})
