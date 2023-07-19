import { useStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', {
  state: () => {
    return { 
        jwt: '',
        user: Object
    }
  },
  getters: {
    loggedIn: (state) => state.jwt !== undefined && state.jwt.length > 1
  },
  actions:{
    initialise(){
      const storage = useStorage('user-store',{ jwt:'', user:Object },localStorage,{ mergeDefaults: true })

      let data = JSON.parse(localStorage.getItem("user-store"))

      this.user = data.user;
      this.jwt = data.jwt;
    },
    setUser(jwt, user){
      this.jwt = jwt;
      this.user = user;

      localStorage.setItem('user-store', JSON.stringify({ jwt:jwt, user:this.user }) )
    },
    Logout(){
      this.jwt = '';
      this.user = null;

      localStorage.removeItem('user-store')
    }
  }
})