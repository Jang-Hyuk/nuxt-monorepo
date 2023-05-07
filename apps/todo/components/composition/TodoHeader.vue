<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCompositionStore } from '~/store/composition'

const store = useCompositionStore()
const { todoFlag } = storeToRefs(store)
</script>

<template>
  <ul class="wrapper">
    <li
      class="todoHeader"
      :class="{ selected: todoFlag === 'all' }"
      @click="todoFlag = 'all'"
    >
      모두
    </li>
    <li
      class="todoHeader"
      :class="{ selected: todoFlag === 'done' }"
      @click="todoFlag = 'done'"
    >
      완료
    </li>
    <li
      class="todoHeader" :class="{ selected: todoFlag === 'none' }"
      @click="todoFlag = 'none'"
    >
      미완료
    </li>
  </ul>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: 1rem;

  .todoHeader {
    border: 1px solid blue;
        background-color: aliceblue;
          padding: 0.5rem 1rem;
    cursor: pointer;
  }
  .selected {
    background-color: aquamarine;
  }
}
</style>
