<script setup lang="ts">
import { storeToRefs } from 'pinia'
import TodoItem from './TodoItem.vue'
import { useCompositionStore } from '~/store/composition'

const { realTodoList } = storeToRefs(useCompositionStore())
</script>

<template>
  <TodoItem v-for="(item) in realTodoList" :key="item.id" :todo-id="item.id" />
</template>

<style scoped>

</style>
