<script setup lang="ts">
import TodoItem from './TodoItem.vue'

import { useCompositionStore } from '~/store/composition'

const { todoList } = useCompositionStore()
</script>

<template>
  <TodoItem v-for="(item) in todoList" :key="item.id" :todo-id="item.id" />
</template>

<style scoped>

</style>
