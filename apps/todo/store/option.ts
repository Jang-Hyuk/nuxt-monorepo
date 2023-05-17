import { defineStore } from 'pinia'

import type { TodoFlag } from '~/store/composition'

export interface Todo {
  title: string
  isDone: boolean
  id: number
}

switch ('1') {
  case '1':
    break
}

export const useOptionStore = defineStore('option', {
  state: () => ({
    LOCAL_ID: 'optionAPI',
    todoList: [] as Todo[],
    todoFlag: 'all' as TodoFlag,
  }),
  getters: {
    realTodoList(state) {
      return state.todoList.filter((todo) => {
        if (state.todoFlag === 'all')
          return true
        if (todo.isDone && state.todoFlag === 'done')
          return true
        if (!todo.isDone && state.todoFlag === 'none')
          return true

        return false
      })
    },
    getterSubNavigationList: state =>
      (mainPath = '', subPath = '') => {
        // 메인 네비게이션 조회
        const mainNaviInfo = state.navigationList.find(
          naviInfo => naviInfo.path === mainPath,
        )

        // 첫번재 서브 네비게이션 메뉴가 존재하지 않을 경우
        if (mainNaviInfo === undefined)
          return []

        // 서브 네비게이션 Path가 존재하지 않는다면 현재 시점의 링크 반환
        if (!subPath.length)
          return mainNaviInfo.links

        const subNaviInfo = _.find(mainNaviInfo.links, { path: subPath })

        return subNaviInfo === undefined ? [] : subNaviInfo
      },
  },
  actions: {
    addTodo(todoTitle: Todo['title']) {
      this.todoList.push({
        id: +new Date(),
        isDone: false,
        title: todoTitle,
      })
    },
    getTodo(todoId: Todo['id']) {
      const todo = this.todoList.find(todo => todo.id === todoId)
      if (!todo)
        throw new Error(`getData failed... todoId:${todoId} is empty`)

      return todo
    },
    updateTodo(todoId: Todo['id'], todo: Todo) {
      const index = this.todoList.findIndex(todo => todo.id === todoId)

      if (index === -1)
        throw new Error(`update failed... todoId:${todoId} is empty`)

      this.todoList[index] = todo
    },
    deleteTodo(todoId: Todo['id']) {
      const index = this.todoList.findIndex(todo => todo.id === todoId)
      if (index === -1)
        throw new Error(`delete faild... todoId:${todoId} is empty`)

      this.todoList.splice(index, 1)
    },
    syncTodo() {
      localStorage.setItem(this.LOCAL_ID, JSON.stringify(this.todoList))
    },
    initTodo() {
      const todoListRaw = localStorage.getItem(this.LOCAL_ID)
      if (todoListRaw === null) {
        this.todoList = []
        return false
      }

      try {
        const todoList = JSON.parse(todoListRaw)
        if (Array.isArray(todoList))
          this.todoList = todoList
      }
      catch (error) {
        console.error(error)
      }
    },
  },
})
