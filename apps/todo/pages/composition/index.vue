<script setup lang="ts">
import { ref } from 'vue'
import TodoHeader from '~/components/composition/TodoHeader.vue'
import TodoList from '~/components/composition/TodoList.vue'

import { useCompositionStore } from '~/store/composition'

const { addTodo, syncTodo, initTodo } = useCompositionStore()

if (process.client)
  initTodo()

const todoTitle = ref('')

function executeAddTodo() {
  if (!todoTitle.value)
    return false

  addTodo(todoTitle.value)
  todoTitle.value = ''
}
</script>

<template>
  <TodoHeader />
  <div>
    <input v-model="todoTitle" type="text" placeholder="컴포지션 할일을 입력해 닝겐!" @keyup.enter="executeAddTodo">
    <button @click="syncTodo">
      동기화
    </button>
  </div>
  <TodoList />
</template>

<style scoped>

</style>
