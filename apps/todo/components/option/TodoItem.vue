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
  computed: {
    todo() {
      return this.getTodo(this.todoId)
    },
  },
  methods: {
    ...mapActions(useOptionStore, ['deleteTodo', 'getTodo', 'updateTodo']),
  },
})
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
