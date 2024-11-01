<template>
	<main class="flex flex-row overflow-auto">
		<h1>{{ boardStore.board.name }}</h1>
		<BoardColumn 
			v-for="(col, colIndex) in boardStore.board.columns" 
			:key="col.id"
			:column="col"
			:columnIndex="colIndex"	
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
import {useBoardStore} from '../stores/boardStore'

const boardStore = useBoardStore()
const route = useRoute()
const router = useRouter()

const isModalOpen = computed(() => {
	return route.name === 'index-tasks-id'
})
const newColumnName = ref('')

function addColumn() {
	boardStore.addColumn(newColumnName.value)
	newColumnName.value = ''
}

function closeModal() {
	router.push('/')
}
</script>