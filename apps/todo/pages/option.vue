<script lang="ts">
import { mapActions } from 'pinia'
import TodoHeader from '~/components/option/TodoHeader.vue'
import TodoList from '~/components/option/TodoList.vue'

import type { Todo } from '~/store/option'
import { useOptionStore } from '~/store/option'

export default defineNuxtComponent({
  setup() {
    if (process.client) {
      const { initTodo } = useOptionStore()

      initTodo()
    }
  },
  components: { TodoHeader, TodoList },
  data() {
    return {
      todoTitle: '' as Todo['title'],
    }
  },
  methods: {
    ...mapActions(useOptionStore, ['addTodo', 'syncTodo', 'initTodo']),
    /** 투두 등록 */
    executeAddTodo() {
      if (!this.todoTitle)
        return false

      this.addTodo(this.todoTitle)
      this.todoTitle = ''
    },
  },
})
</script>

<template>
  <TodoHeader />
  <div>
    <input v-model="todoTitle" type="text" placeholder="입력해라 닝겐" @keyup.enter="executeAddTodo">
    <button @click="syncTodo">
      동기화
    </button>
  </div>
  <TodoList />
</template>

<style scoped>

</style>
