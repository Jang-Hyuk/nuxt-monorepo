import { ref } from 'vue'

import { defineStore } from 'pinia'

import type { Todo } from '~/store/option'

/** all: 모두, done: 완료만, none: 미완료만 */
export type TodoFlag = 'all' | 'done' | 'none'

export const useCompositionStore = defineStore('composition', () => {
  const LOCAL_ID = 'compositionAPI'
  const todoList = ref([] as Todo[])
  const todoFlag = ref('all' as TodoFlag)
  const realTodoList = computed(() => todoList.value.filter((todo) => {
    if (todoFlag.value === 'all')
      return true
    if (todo.isDone && todoFlag.value === 'done')
      return true
    if (!todo.isDone && todoFlag.value === 'none')
      return true

    return false
  }))

  function addTodo(todoTitle: Todo['title']) {
    todoList.value.push({
      id: +new Date(),
      isDone: false,
      title: todoTitle,
    })
  }

  function getTodo(todoId: Todo['id']) {
    const todo = todoList.value.find(todo => todo.id === todoId)
    if (!todo)
      throw new Error(`getData failed... todoId:${todoId} is empty`)

    return todo
  }

  function updateTodo(todoId: Todo['id'], todo: Todo) {
    const index = todoList.value.findIndex(todo => todo.id === todoId)

    if (index === -1)
      throw new Error(`update failed... todoId:${todoId} is empty`)

    todoList.value[index] = todo
  }

  function deleteTodo(todoId: Todo['id']) {
    const index = todoList.value.findIndex(todo => todo.id === todoId)
    if (index === -1)
      throw new Error(`delete faild... todoId:${todoId} is empty`)

    todoList.value.splice(index, 1)
  }

  function syncTodo() {
    localStorage.setItem(LOCAL_ID, JSON.stringify(todoList.value))
  }

  function initTodo() {
    const todoListRaw = localStorage.getItem(LOCAL_ID)
    if (todoListRaw === null) {
      todoList.value = []
      return false
    }

    try {
      const storeTodoList = JSON.parse(todoListRaw)
      if (Array.isArray(storeTodoList))
        todoList.value = storeTodoList
    }
    catch (error) {
      console.error(error)
    }
  }

  return {
    todoList,
    realTodoList,
    todoFlag,
    addTodo,
    getTodo,
    updateTodo,
    deleteTodo,
    syncTodo,
    initTodo,
  }
})
