<template>
<ULink v-for="board in boardsStore.boards" :to="`/test/${board.id}`">
	{{ board.name }}
</ULink>
</template>
<script setup>
const boardsStore = useBoardsStore()
</script>