<script setup lang="ts">
import { useCompositionStore } from '~/store/composition'

const props = defineProps(['todoId'])

const { getTodo, updateTodo, deleteTodo } = useCompositionStore()

const todo = getTodo(props.todoId)
</script>

<template>
  <div>
    완료: <input v-model="todo.isDone" type="checkbox"> {{ todo?.title }}
    <button @click="deleteTodo(todoId)">
      삭제
    </button>
  </div>
</template>

<style scoped>

</style>
