<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import BlockerAddTask from './blocker-add-task.svelte';
	import BlocktCell from './blockt-cell.svelte';
	import BlocktRenderBlock from './blockt-render-block.svelte';
	import { createBlocktDay, hourToReadable, type BlocktDay } from './types.svelte';

	type Props = {
		blocktDay: BlocktDay;
	};
	let { blocktDay }: Props = $props();

	let day = $derived(blocktDay.day);
	let blockHours = $derived([
		...Array((day.endHour - day.startHour) / day.blockSizeHours)
			.keys()
			.map((i) => day.startHour + i * day.blockSizeHours)
	]);

	let gridWrapper: HTMLDivElement;
	let gridCells: Element[] = $state([]);
	let blocktWrapper: HTMLDivElement;
	let leftOffset = $state(0);
	let rightOffset = 0;
	const cellPadding = 2;
	const updateGridCells = () => {
		if (!gridWrapper) return;
		gridCells = [];
		gridWrapper.querySelectorAll('.blockt-cell').forEach((cell) => {
			gridCells.push(cell);
		});
		const elem = gridCells[0] as HTMLElement;
		leftOffset = elem.offsetLeft;
	};

	const renderBlocks = $derived.by(() => {
		updateGridCells();
		if (gridCells.length === 0) return [];
		const day = blocktDay.day;
		const blocks = blocktDay.day.blocks;
		return blocks.map((block) => {
			const exampleCell = gridCells[0] as HTMLElement;
			const startIndex = (block.start - day.startHour) / day.blockSizeHours;
			const endIndex = (block.end - day.startHour) / day.blockSizeHours;
			const topOffset = (gridCells[startIndex] as HTMLElement).offsetTop + cellPadding;
			const height = (endIndex - startIndex) * exampleCell.offsetHeight - 2 * cellPadding;

			return {
				top: topOffset,
				left: leftOffset + cellPadding,
				right: rightOffset + cellPadding,
				height: height,
				timeBlock: block
			};
		});
	});
</script>

<div class="relative mx-auto max-w-prose" bind:this={blocktWrapper}>
	{#each renderBlocks as block (block.timeBlock.id)}
		<BlocktRenderBlock {...block} />
	{/each}
	<div
		class={`grid grid-rows-${blockHours.length} w-full grid-cols-[auto_1fr] gap-x-2`}
		bind:this={gridWrapper}
	>
		{#each blockHours as hour, i}
			<div class="justify-self-end py-1">
				<span class="muted">
					{hourToReadable(hour)}
				</span>
			</div>
			<BlocktCell {hour} index={i} {blocktDay} />
		{/each}
	</div>
</div>
