<script setup lang="ts">
import { ref } from 'vue'
import TodoHeader from '~/components/composition/TodoHeader.vue'
import TodoList from '~/components/composition/TodoList.vue'

import { useCompositionStore } from '~/store/composition'
import type { Todo } from '~/store/option'

const { addTodo, syncTodo, initTodo } = useCompositionStore()

const todoTitle = ref('' as Todo['title'])

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
    <button @click="initTodo">
      초기화
    </button>
  </div>
  <TodoList />
</template>

<style scoped>

</style>
