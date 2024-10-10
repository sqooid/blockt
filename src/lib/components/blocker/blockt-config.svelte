<script lang="ts">
	import { Button } from '../ui/button';
	import { Label } from '../ui/label';
	import BlocktConfigTime from './blockt-config-time.svelte';
	import { pageState, type BlocktDay } from './types.svelte';

	type Props = {
		blocktDay: BlocktDay;
	};
	let { blocktDay }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="grid w-full max-w-prose gap-2 sm:grid-cols-2">
		<Label>
			<span>Start time</span>
			<BlocktConfigTime
				bind:value={blocktDay.day.startHour}
				min={0}
				max={blocktDay.day.endHour}
				step={blocktDay.day.blockSizeHours}
			/>
		</Label>
		<Label>
			<span>End time</span>
			<BlocktConfigTime
				bind:value={blocktDay.day.endHour}
				min={blocktDay.day.startHour + blocktDay.day.blockSizeHours}
				max={24}
				step={blocktDay.day.blockSizeHours}
			/>
		</Label>
	</div>
	<Button variant="destructive" on:click={() => (blocktDay.day.blocks = [])}>Clear blocks</Button>
	<div>
		<Button variant="outline" on:click={() => (pageState.showConfig = false)}>Close</Button>
	</div>
</div>
