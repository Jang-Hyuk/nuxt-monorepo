import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'hello',
  },
  setup() {
    const { resolve } = createResolver(import.meta.url)

    addServerHandler({
      route: '/api/hello',
      handler: resolve('./runtime/api-route'),
    })
  },
})
