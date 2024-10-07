<script lang="ts">
	import BlockerAddTask from './blocker-add-task.svelte';
	import BlocktCell from './blockt-cell.svelte';
	import { createBlocktDay, hourToReadable } from './types.svelte';

	type Props = {
		blocktDay: ReturnType<typeof createBlocktDay>;
	};
	let { blocktDay }: Props = $props();

	let day = $derived(blocktDay.day);
	let blockHours = $derived([
		...Array((day.endHour - day.startHour) / day.blockSizeHours)
			.keys()
			.map((i) => day.startHour + i * day.blockSizeHours)
	]);

	let gridWrapper: HTMLDivElement;
	let gridCells = [];
	const updateGridCells = () => {
		gridCells = [];
		gridWrapper.querySelectorAll('.blockt-grid').forEach((cell) => {
			gridCells.push(cell);
		});
	};

	let clickedCell: HTMLButtonElement | null = $state(null);
	const onCell = (e: MouseEvent, index: number) => {
		clickedCell = e.target as HTMLButtonElement;
		console.log(`clicked cell ${index}`);
	};
</script>

<div
	class={`grid grid-rows-${blockHours.length} w-full grid-cols-[auto_1fr] gap-x-2`}
	bind:this={gridWrapper}
>
	{#each blockHours as hour, i}
		<div class="justify-self-end py-1">
			{hourToReadable(hour)}
		</div>
		<BlocktCell />
	{/each}
</div>
