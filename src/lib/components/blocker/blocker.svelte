<script lang="ts">
	import { range } from 'lodash-es';
	import BlocktCell from './blockt-cell.svelte';
	import BlocktRenderBlock from './blockt-render-block.svelte';
	import { currentTime, getGridCellInfo, hourToReadable, type BlocktDay } from './types.svelte';
	import BlocktCurrentTimeBar from './blockt-current-time-bar.svelte';

	type Props = {
		blocktDay: BlocktDay;
	};
	let { blocktDay }: Props = $props();

	let day = $derived(blocktDay.day);
	let blockHours = $derived(
		range(day.startHour, day.endHour + day.blockSizeHours, day.blockSizeHours)
	);

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

	const currentTop = $derived.by(() => {
		const hour = currentTime.hour;
		const gridInfo = getGridCellInfo(gridWrapper);
		if (!gridInfo) return null;
		const day = blocktDay.day;
		const cellOffset = (hour - day.startHour) / day.blockSizeHours;
		if (cellOffset < 0 || cellOffset >= gridInfo.cells.length) return null;
		return gridInfo.cellHeight * cellOffset;
	});
	const gridLeft = $derived(getGridCellInfo(gridWrapper)?.leftOffset ?? null);
</script>

<div class="relative mx-auto max-w-prose">
	<BlocktCurrentTimeBar top={currentTop} hour={currentTime.hour} left={gridLeft} />
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
				<span class="muted block -translate-y-1/2 text-nowrap">
					{hourToReadable(hour)}
				</span>
			</div>
			{#if i === blockHours.length - 1}
				<div></div>
			{:else}
				<BlocktCell {hour} index={i} {blocktDay} />
			{/if}
		{/each}
	</div>
</div>
