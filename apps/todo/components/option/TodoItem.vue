<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'pinia'

import { useOptionStore } from '~/store/option'

export default defineComponent({
  props: {
    todoId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      key: 1,
    }
  },
  computed: {
    todo() {
      return this.getTodo(this.todoId)
    },
  },
  methods: {
    ...mapActions(useOptionStore, ['deleteTodo', 'getTodo', 'updateTodo']),
    executeUpdate() {
      this.todo.isDone = !this.todo.isDone
      this.updateTodo(this.todoId, this.todo)
    },
  },
})
</script>

<template>
  <div>
    완료: <input v-model="todo.isDone" type="checkbox" @click="executeUpdate"> {{ todo?.title }}
    <button @click="deleteTodo(todoId)">
      삭제
    </button>
  </div>
</template>

<style scoped>

</style>
