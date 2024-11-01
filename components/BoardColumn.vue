<template>
	<UCard 
	class="w-1/3 mr-8 h-fit"
	draggable="true"
	@dragstart.self="pickupColumn($event, columnIndex)"
	@dragenter.prevent 
	@dragover.prevent 
	@drop.stop="dropItem($event, {toColumnIndex: columnIndex})">
			<template #header>
				<div class="flex flex-row justify-between mb-4">
				<div class="text-xl font-semibold">
					<UInput v-if="editNameState" type="text" v-model="column.name" />
					<h2 v-else >{{ column.name }}</h2>
				</div>
				<div>
					<UButton icon="i-heroicons-pencil-square" class="mr-2"
						@click="editNameState = !editNameState"
					/>
					<UButton icon="i-heroicons-trash" color="red"
						@click="deleteColumn(columnIndex)"	
					/>
				</div>
			</div>
			</template>
			
			<ul class="grid grid-cols-1 gap-y-4">
				<TransitionGroup appear name="grow">
					<li class=""
						v-for="(task, taskIndex) in column.tasks"
						:key="task.id">
					<UCard 
						class="w-full"
						@click="goToTask(task.id)"
						draggable="true"
						@dragstart="pickupTask($event, {
							fromTaskIndex: taskIndex,
							fromColumnIndex: columnIndex
						})"
						@drop.stop="dropItem($event, {
							toColumnIndex: columnIndex,
							toTaskIndex: taskIndex
						})"
						>
						<strong>{{ task.name }}</strong>
						<p>{{ task.description }}</p>
					</UCard>
					</li>
				</TransitionGroup>
			</ul>
			<template #footer>
				<UInput 
					type="text" 
					placeholder="Create a new task" 
					icon="i-heroicons-plus-circle-solid"
					v-model="newTaskName"
					@keyup.enter="addTask"/>
			</template>
			
		</UCard 
		>
</template>

<script setup>
import { useBoardStore } from '../stores/boardStore'

const emit = defineEmits(['addTask',
'deleteTask',
'moveTask',
'moveColumn',
'deleteColumn'])

const router = useRouter()

const props = defineProps({
	column: {
		type: Object,
		required: true
	},
	columnIndex: {
		type: Number,
		required: true
	}
})

const editNameState = ref('')

function deleteColumn(columnIndex) {
	emit('deleteColumn',columnIndex)
}

function goToTask(taskId) {
	router.push(`/tasks/${taskId}`)
}

const newTaskName = ref('')

function addTask() {
	emit('addTask', {taskName: newTaskName.value, columnIndex: props.columnIndex})
	newTaskName.value = ''
}

function pickupTask(event, { fromColumnIndex, fromTaskIndex }) {
	event.dataTransfer.effectAllowed = 'move'
	event.dataTransfer.dropEffect = 'move'
	event.dataTransfer.setData('from-column-index', fromColumnIndex)
	event.dataTransfer.setData('from-task-index', fromTaskIndex)
	event.dataTransfer.setData('type', 'task')
}

function dropItem(event, { toColumnIndex, toTaskIndex }) {
	const type = event.dataTransfer.getData('type')
	
	const fromColumnIndex = event.dataTransfer.getData('from-column-index')

	if (type === 'task') {
		const fromTaskIndex = event.dataTransfer.getData('from-task-index')
		
		emit('moveTask',{
			fromTaskIndex,
			fromColumnIndex,
			toColumnIndex,
			toTaskIndex
		})
	} else if (type === 'column') {
		emit('moveColumn',{
			fromColumnIndex,
			toColumnIndex
		})
	}
	
}

function pickupColumn(event, fromColumnIndex) {
	event.dataTransfer.effectAllowed = 'move'
	event.dataTransfer.dropEffect = 'move'
	event.dataTransfer.setData('from-column-index', fromColumnIndex)
	event.dataTransfer.setData('type', 'column')
}
</script>
<style scoped>
.grow-enter-active,
.grow-leave-active {
	transition: all 0.2s ease-in;
}

.grow-enter-from,
.grow-leave-to {
	height: 0px;
	overflow: hidden;
	opacity: 0;
}

.grow-enter-to,
.grow-leave-from {
	height: 64px;
	opacity:1;
}
</style>