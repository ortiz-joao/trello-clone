import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuid } from 'uuid' 
import boardData from '~/data/board.json'

export const useBoardStore = defineStore('boardStore', () => {
	const board = useStorage('board', boardData)

	//tasks
	const getTask = computed(() => {
		return taskId => {
			for (const column of board.value.columns) {
				const task = column.tasks.find(task => task.id === taskId)
				if(task) return task
			}
		}
	})

	function addTask({taskName, columnIndex}) {
		board.value.columns[columnIndex].tasks.push({
			id: uuid(),
			name: taskName,
			description: ''
		})
	}

	function deleteTask(taskId) {
		for (const column of board.value.columns) {
			const taskIndex = column.tasks.findIndex(task => task.id === taskId)
			
			if(taskIndex !== -1) {
				column.tasks.splice(taskIndex, 1)
				return
			}
		}
	}

	function moveTask({fromTaskIndex, fromColumnIndex, toColumnIndex, toTaskIndex}) {
		const task = board.value.columns[fromColumnIndex].tasks.splice(fromTaskIndex, 1)[0]

		board.value.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task)
	}

	//columns
	function addColumn(columnName) {
		board.value.columns.push({
			name: columnName,
			tasks: []
		})
	}

	function deleteColumn(columnIndex) {
		board.value.columns.splice(columnIndex, 1)
	}

	function moveColumn({ fromColumnIndex, toColumnIndex}) {
		const column = board.value.columns.splice(fromColumnIndex, 1)[0]
		board.value.columns.splice(toColumnIndex, 0, column)
	}

	return {
		board,
		addColumn,
		deleteColumn,
		getTask,
		addTask,
		deleteTask,
		moveTask,
		moveColumn
	}
})