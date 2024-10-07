<script lang="ts">
	import BlockerAddTask from './blocker-add-task.svelte';
	import type { BlocktDay } from './types.svelte';

	type Props = {
		hour: number;
		index: number;
		blocktDay: BlocktDay;
	};
	let { hour, index, blocktDay }: Props = $props();

	const onCell = (e: MouseEvent) => {
		showAddTask = true;
	};
	let showAddTask = $state(false);
</script>

<div class="blockt-cell relative h-full w-full">
	<button
		class="h-full w-full cursor-pointer"
		title="Add task"
		onclick={onCell}
		aria-label="Add task"
	></button>
	<BlockerAddTask bind:show={showAddTask} {blocktDay} {hour} />
</div>
