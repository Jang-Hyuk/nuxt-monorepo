<script setup lang="ts">
definePageMeta({
  middleware: [
    'test-middleware',
  ],
})
</script>

<template>
  <div>
    파람값을 보자: {{ $route.params }}
  </div>
</template>

<style scoped>

</style>
