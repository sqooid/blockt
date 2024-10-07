<script lang="ts">
	import BlockerAddTask from './blocker-add-task.svelte';

	const onCell = (e: MouseEvent) => {
		showAddTask = true;
	};
	let showAddTask = $state(false);
</script>

<div class="blockt-cell relative">
	<button
		class="blockt-grid h-full w-full cursor-pointer border border-solid"
		title="Add task"
		onclick={onCell}
		aria-label="Add task"
	></button>
	<BlockerAddTask bind:show={showAddTask} />
</div>
