<script lang="ts">
	import { Button } from '../ui/button';
	import BlockerAddTask from './blocker-add-task.svelte';
	import { pageState, type BlocktDay } from './types.svelte';

	type Props = {
		hour: number;
		index: number;
		blocktDay: BlocktDay;
	};
	let { hour, index, blocktDay }: Props = $props();
</script>

<div class="blockt-cell relative h-full w-full">
	<BlockerAddTask {blocktDay} {hour}>
		{#snippet trigger(builder: any)}
			<Button
				class={`h-full w-full cursor-pointer ${pageState.dragging ? 'pointer-events-none hover:bg-transparent' : ''}`}
				title="Add task"
				variant="ghost"
				builders={[builder]}
			></Button>
		{/snippet}
	</BlockerAddTask>
</div>
