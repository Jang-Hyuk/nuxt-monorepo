<script lang="ts">
export default defineNuxtComponent({
  setup() {
    return {}
  },
  // middleware: ['test-middleware'],
})
</script>

<template>
  <div>
    <NuxtLink :to="{ name: 'page-id', params: { id: 1 } }">
      동적 페이지로 쑝
    </NuxtLink>
    <NuxtLink to="">
      dd
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>
