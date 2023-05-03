<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import TodoItem from './TodoItem.vue'

import { useOptionStore } from '~/store/option'

export default defineComponent({
  components: { TodoItem },
  setup() {
    return {}
  },
  computed: {
    ...mapState(useOptionStore, ['todoList']),

  },
})
</script>

<template>
  <TodoItem v-for="(item) in todoList" :key="item.id" :todo-id="item.id" />
</template>

<style scoped>

</style>
