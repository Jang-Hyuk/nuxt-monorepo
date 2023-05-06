<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import TodoItem from './TodoItem.vue'

import { useOptionStore } from '~/store/option'

export default defineComponent({
  components: { TodoItem },
  computed: {
    ...mapState(useOptionStore, ['realTodoList']),
  },
})
</script>

<template>
  <TodoItem v-for="(item) in realTodoList" :key="item.id" :todo-id="item.id" />
</template>

<style scoped>

</style>
