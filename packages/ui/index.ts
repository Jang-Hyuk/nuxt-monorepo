import { join } from 'node:path'
import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup(resolvedOptions, nuxt) {
    // here we need to setup our components
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: join(__dirname, 'lib/components'),
        prefix: 'nx3',
      })
    })

    const { resolve } = createResolver(import.meta.url)

    // add the helper plugin
    addPlugin(resolve('lib/plugins/helper.ts'))

    // add animate.css file from animate.css library
    nuxt.options.css.push('animate.css')
  },
})
