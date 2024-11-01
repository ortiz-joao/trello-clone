<script setup>
import { useBoardStore } from '~/stores/boardStore'

const boardStore = useBoardStore()
const route = useRoute()
const router = useRouter()

const task = computed(() => {
	return boardStore.getTask(route.params.id)
})

function deleteTask() {
	boardStore.deleteTask(route.params.id)
	router.push('/')
}
</script>

<template>
	<div class="task-wrapper">
		<UCard class="">
			<template v-if="task" #header>
				<UFormGroup label="Name" class="mb-4">
					<UInput type="text" v-model="task.name"/>
				</UFormGroup>
			</template>
			<section v-if="task" class="w-full">
			
			<UFormGroup label="Description" class="mb-4">
				<UTextarea v-model="task.description" />
			</UFormGroup>
			<UButton 
					icon="i-heroicons-trash" 
					color="red"
					@click="deleteTask" />
			</section>
			<section v-else>
				<p>Task not found.</p>
			</section>

		</UCard>
	</div>
</template>