import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtModule({
  // hooks: {
  //   'components:dirs': (dirs) => {
  //     dirs.push({
  //       path: join(__dirname, 'lib/components'),
  //       prefix: 'cu',
  //     })
  //   },
  // },

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
