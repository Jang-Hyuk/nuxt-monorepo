export default defineNuxtPlugin((nuxtApp) => {
  const foo = useFoo()
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}, Foo: ${foo.value}`,
    },
  }
})
