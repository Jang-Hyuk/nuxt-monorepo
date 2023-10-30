export default defineNuxtPlugin({
  name: 'my-plugin',
  enforce: 'pre',
  async setup(nuxtApp) {

  },
  hooks: {
    'app:created': function () {
      const nuxtApp = useNuxtApp()
      nuxtApp.payload.data.hi = 1
    },
  },
})
