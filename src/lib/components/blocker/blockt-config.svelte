<script lang="ts">
	import { getContext } from 'svelte';
	import { Button } from '../ui/button';
	import { Label } from '../ui/label';
	import { Switch } from '../ui/switch';
	import BlocktConfigTime from './blockt-config-time.svelte';
	import { pageState, type BlocktDay } from './types.svelte';
	import type { AppConfig } from '../config.svelte';
	import { ChevronsDownUp, Trash } from 'lucide-svelte';

	type Props = {
		blocktDay: BlocktDay;
	};
	let { blocktDay }: Props = $props();

	const config = getContext('config') as AppConfig;
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
		<Label class="flex items-center justify-between">
			<span>Use move handles</span>
			<Switch bind:checked={config.useMoveHandles} />
		</Label>
	</div>
	<Button variant="destructive" on:click={() => (blocktDay.day.blocks = [])}>
		<Trash class="mr-2 h-6 w-6" />
		Clear blocks</Button
	>
	<Button variant="outline" on:click={() => (pageState.showConfig = false)}>
		<ChevronsDownUp class="mr-2 h-6 w-6" />
		Close</Button
	>
</div>
