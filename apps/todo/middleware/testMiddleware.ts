export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.id === '1') {
    console.log('거부다', to, from, import.meta.url)
    return abortNavigation()
  }

  if (to.path !== '/')
    return navigateTo('/')
})
