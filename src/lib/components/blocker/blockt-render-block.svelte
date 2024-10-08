<script lang="ts">
	import { scale } from 'svelte/transition';
	import { BlocktDay, getGridCellInfo, type GridInfo, type TimeBlock } from './types.svelte';
	import { backInOut, quartInOut } from 'svelte/easing';

	type Props = {
		top: number;
		left: number;
		right: number;
		height: number;
		timeBlock: TimeBlock;
		blocktDay: BlocktDay;
		gridWrapper: HTMLElement;
	};
	let { top, left, right, height, timeBlock, gridWrapper, blocktDay }: Props = $props();

	let gridInfo: GridInfo | null = null;
	let extendSide: 'top' | 'bottom' | null = $state(null);
	const onMouseDown = (e: MouseEvent | TouchEvent) => {
		gridInfo = getGridCellInfo(gridWrapper);
		const target = e.target as HTMLElement;
		extendSide = target.dataset.side as 'top' | 'bottom';
		// lock scrolling

		addListeners();
	};
	const addListeners = () => {
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('touchmove', onMouseMove, { passive: false });
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('touchend', onMouseUp);
	};
	const removeListeners = () => {
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('touchmove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
		document.removeEventListener('touchend', onMouseUp);
		extendSide = null;
	};
	const onMouseMove = (e: MouseEvent | TouchEvent) => {
		// expect grid info to be updated
		let y = 0;
		if (e instanceof TouchEvent) {
			e.preventDefault();
			y = e.touches[0].pageY;
		} else {
			y = e.pageY;
		}
		const cells = gridInfo?.cells;
		if (!cells) return;
		let cellPosition = 0;
		for (let i = 0; i < cells.length; i++) {
			if (y > cells[i].pageTop) {
				continue;
			}
			cellPosition = i;
			break;
		}
		const newHour = blocktDay.day.startHour + cellPosition * blocktDay.day.blockSizeHours;
		console.log('newHour', newHour);
		if (extendSide === 'bottom') {
			if (newHour !== timeBlock.end) {
				blocktDay.moveBlockEnd(timeBlock.id, newHour);
			}
		} else {
			if (newHour !== timeBlock.start) {
				blocktDay.moveBlockStart(timeBlock.id, newHour);
			}
		}
	};
	const onMouseUp = (e: MouseEvent | TouchEvent) => {
		removeListeners();
	};
</script>

{#snippet handle(side: 'top' | 'bottom')}
	<button
		class={`absolute left-0 right-0 h-2 w-full cursor-ns-resize rounded-full hover:bg-black hover:bg-opacity-10 ${side}-0 ${extendSide === side ? 'bg-black bg-opacity-10' : ''}`}
		aria-label="Resize"
		onmousedown={onMouseDown}
		ontouchstart={onMouseDown}
		data-side={side}
	></button>
{/snippet}

<div
	class="absolute z-10 cursor-pointer rounded-sm bg-black bg-opacity-10"
	id={timeBlock.id}
	style:top={top + 'px'}
	style:left={left + 'px'}
	style:right={right + 'px'}
	style:height={height + 'px'}
	transition:scale={{ duration: 200, easing: quartInOut }}
>
	{@render handle('top')}
	<span class="small ml-4">
		{timeBlock.task}
	</span>
	{@render handle('bottom')}
</div>
