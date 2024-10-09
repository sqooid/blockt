<script lang="ts">
	import { Plus } from 'lucide-svelte';
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
		{#snippet trigger(builder: any, open: boolean)}
			<Button
				class={`group h-full w-full cursor-pointer ${pageState.draggingEdge ? 'pointer-events-none hover:bg-transparent' : ''} ${open ? 'bg-accent' : ''}`}
				title="Add task"
				variant="ghost"
				builders={[builder]}
			>
				<div class={`flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100`}>
					<Plus class="h-4 w-4" />
					<span class="muted"> Add block </span>
				</div>
			</Button>
		{/snippet}
	</BlockerAddTask>
</div>
