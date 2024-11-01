<template>
	<main v-if="board" class="flex flex-row overflow-auto">
		<h1>{{ board.name }}</h1>
		<BoardColumn 
			v-for="(col, colIndex) in board.columns" 
			:key="col.id"
			:column="col"
			:columnIndex="colIndex"
			@addTask="addTask"
			@deleteTask="deleteTask"
			@moveTask="moveTask"
			@moveColumn="moveColumn"
			@deleteColumn="deleteColumn"
		/>
		<UContainer class="column">
			<UInput 
				type="text" 
				placeholder="Create a new column" 
				icon="i-heroicons-plus-circle-solid"
				v-model="newColumnName"
				@keyup.enter="addColumn"/>
		</UContainer>
	</main>
	<div v-show="isModalOpen" @click.self="closeModal" class="task-bg">
		<NuxtPage :key="route.fullPath"/>
	</div>
</template>
<script setup>
import { v4 as uuid} from 'uuid'

const boardsStore = useBoardsStore()

const route = useRoute()
const router = useRouter()
console.log(boardsStore)
const board = boardsStore.getBoard(route.params.board)

console.log(board)
const isModalOpen = computed(() => {
	return route.name === 'index-tasks-id'
})

const newColumnName = ref('')

function closeModal() {
	router.push('/')
}

function addTask({taskName, columnIndex}) {
		board.columns[columnIndex].tasks.push({
			id: uuid(),
			name: taskName,
			description: ''
		})
	}

	function deleteTask(taskId) {
		for (const column of board.columns) {
			const taskIndex = column.tasks.findIndex(task => task.id === taskId)
			
			if(taskIndex !== -1) {
				column.tasks.splice(taskIndex, 1)
				return
			}
		}
	}

	function moveTask({fromTaskIndex, fromColumnIndex, toColumnIndex, toTaskIndex}) {
		const task = board.columns[fromColumnIndex].tasks.splice(fromTaskIndex, 1)[0]

		board.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task)
	}

	//columns
	function addColumn() {
		board.columns.push({
			name: newColumnName.value,
			tasks: []
		})
		newColumnName.value = ''
	}

	function deleteColumn(columnIndex) {
		board.columns.splice(columnIndex, 1)
	}

	function moveColumn({ fromColumnIndex, toColumnIndex}) {
		const column = board.columns.splice(fromColumnIndex, 1)[0]
		board.columns.splice(toColumnIndex, 0, column)
	}
</script>