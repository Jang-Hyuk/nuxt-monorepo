<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

defineEmits<{
  (e: 'submit', value: string): void
}>()
</script>

<template>
  <button class="btn" :disabled="disabled" @click="$emit('submit')">
    <slot>Button</slot>
  </button>
</template>

<style scoped>
.btn {
  padding: 0.5rem;
  background-color: aqua;
  color: black
}
</style>
