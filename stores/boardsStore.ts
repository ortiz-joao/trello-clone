import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuid } from 'uuid' 
import boardData from '~/data/board.json'

export const useBoardsStore = defineStore('boardsStore', () => {
	const boards = useStorage('boards', boardData)
	
	const getBoard = computed(()=>{
		return boardId => {
			return boards.value.find(board => board.id === boardId)
		}
	})

	function addBoard({name}) {
		boards.value.push({
			name,
			id: uuid(),
			columns: []
		})
	}

	function deleteBoard({boardId}) {
		const boardIdx = boards.value.findIndex(board => board.id === boardId)

		if(boardIdx !== -1) {
			boards.value.splice(boardIdx, 1)
		}
	}
	
	return {
		boards,
		getBoard,
		addBoard,
		deleteBoard
	}
})