<script lang="ts">
	import { range } from 'lodash-es';
	import BlocktCell from './blockt-cell.svelte';
	import BlocktRenderBlock from './blockt-render-block.svelte';
	import { getGridCellInfo, hourToReadable, type BlocktDay } from './types.svelte';

	type Props = {
		blocktDay: BlocktDay;
	};
	let { blocktDay }: Props = $props();

	let day = $derived(blocktDay.day);
	let blockHours = $derived(range(day.startHour, day.endHour, day.blockSizeHours));

	let gridWrapper: HTMLElement | null = $state(null);

	const cellPadding = 2;
	const renderBlocks = $derived.by(() => {
		const gridInfo = getGridCellInfo(gridWrapper);
		if (!gridInfo) return [];
		const day = blocktDay.day;
		const blocks = blocktDay.day.blocks;
		return blocks.map((block) => {
			const startIndex = (block.start - day.startHour) / day.blockSizeHours;
			const endIndex = (block.end - day.startHour) / day.blockSizeHours;
			const topOffset = gridInfo.cells[startIndex].top + cellPadding;
			const height = (endIndex - startIndex) * gridInfo.cellHeight - 2 * cellPadding;

			return {
				top: topOffset,
				left: gridInfo.leftOffset + cellPadding,
				width: gridInfo.cellWidth - 2 * cellPadding,
				height: height,
				timeBlock: block
			};
		});
	});
</script>

<div class="relative mx-auto max-w-prose">
	{#if gridWrapper}
		{#each renderBlocks as block (block.timeBlock.id)}
			<BlocktRenderBlock {...block} {gridWrapper} {blocktDay} />
		{/each}
	{/if}
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
