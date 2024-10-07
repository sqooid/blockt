<script lang="ts">
	import BlocktCell from './blockt-cell.svelte';
	import BlocktRenderBlock from './blockt-render-block.svelte';
	import { hourToReadable, type BlocktDay } from './types.svelte';

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

	let gridWrapper: HTMLDivElement | null = $state(null);

	type GridCellInfo = {
		leftOffset: number;
		cellHeight: number;
		cells: { top: number }[];
	};
	const getGridCellInfo = () => {
		if (!gridWrapper) return null;
		const gridInfo: GridCellInfo = { leftOffset: 0, cellHeight: 0, cells: [] };
		gridWrapper.querySelectorAll('.blockt-cell').forEach((cell, i) => {
			const c = cell as HTMLElement;
			if (i === 0) {
				gridInfo.leftOffset = c.offsetLeft;
				gridInfo.cellHeight = c.offsetHeight;
			}
			const cellItem = {
				top: c.offsetTop
			};
			gridInfo.cells.push(cellItem);
		});
		return gridInfo;
	};

	const cellPadding = 2;
	const renderBlocks = $derived.by(() => {
		const gridInfo = getGridCellInfo();
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
				right: cellPadding,
				height: height,
				timeBlock: block
			};
		});
	});

	$effect(() => {
		console.log($state.snapshot(blocktDay.day.blocks));
	});
</script>

<div class="relative mx-auto max-w-prose">
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
