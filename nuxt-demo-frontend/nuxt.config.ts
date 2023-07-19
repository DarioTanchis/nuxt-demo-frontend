// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["bootstrap/dist/css/bootstrap.min.css"],
  modules: [
    // ...
    [
      '@pinia/nuxt', 
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
    '@vueuse/nuxt',
  ],
  experimental: {
    renderJsonPayloads: false
  },
  routeRules:{
    '/': { ssr:false }
  },
  imports: {
    dirs: ["stores"],
  },
})
