<script lang="ts">
	import { scale } from 'svelte/transition';
	import {
		BlocktDay,
		getGridCellInfo,
		pageState,
		printBlocksTestFormat,
		type GridInfo,
		type TimeBlock
	} from './types.svelte';
	import { backInOut, quartInOut } from 'svelte/easing';

	type Props = {
		top: number;
		left: number;
		width: number;
		height: number;
		timeBlock: TimeBlock;
		blocktDay: BlocktDay;
		gridWrapper: HTMLElement;
	};
	let { top, left, width, height, timeBlock, gridWrapper, blocktDay }: Props = $props();
	let blockTop = $state(top);
	let blockLeft = $state(left);

	const placeholderPadding = 2;
	let gridInfo: GridInfo | null = null;
	let extendSide: 'top' | 'bottom' | null = $state(null);
	const onEdgeStart = (e: MouseEvent | TouchEvent) => {
		gridInfo = getGridCellInfo(gridWrapper);
		const target = e.target as HTMLElement;
		e.stopImmediatePropagation();
		extendSide = target.dataset.side as 'top' | 'bottom';
		// lock scrolling

		addEdgeListeners();
	};
	const addEdgeListeners = () => {
		pageState.draggingEdge = true;
		document.addEventListener('mousemove', onEdgeMove);
		document.addEventListener('touchmove', onEdgeMove, { passive: false });
		document.addEventListener('mouseup', onEdgeStop);
		document.addEventListener('touchend', onEdgeStop);
		document.body.style.overscrollBehavior = 'none';
		document.body.style.overflow = 'hidden';
	};
	const removeEdgeListeners = () => {
		pageState.draggingEdge = false;
		document.removeEventListener('mousemove', onEdgeMove);
		document.removeEventListener('touchmove', onEdgeMove);
		document.removeEventListener('mouseup', onEdgeStop);
		document.removeEventListener('touchend', onEdgeStop);
		document.body.style.overscrollBehavior = 'auto';
		document.body.style.overflow = 'auto';
		extendSide = null;
	};
	const onEdgeMove = (e: MouseEvent | TouchEvent) => {
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
		let newHour = blocktDay.day.startHour + cellPosition * blocktDay.day.blockSizeHours;
		if (extendSide === 'top') newHour -= blocktDay.day.blockSizeHours;
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
	const onEdgeStop = (e: MouseEvent | TouchEvent) => {
		removeEdgeListeners();
	};
	const getEventCoords = (e: MouseEvent | TouchEvent) => {
		let x, y;
		if (e instanceof TouchEvent) {
			e.preventDefault();
			y = e.touches[0].pageY;
			x = e.touches[0].pageX;
		} else {
			y = e.pageY;
			x = e.pageX;
		}
		return { x, y };
	};
	let moveStartCoord = $state({ x: 0, y: 0 });
	let moveStartPos = { top: 0, left: 0 };
	let transform = $state({ x: 0, y: 0 });
	let moveStartTime = 0;
	const blockPos = $derived({
		top: moveStartPos.top + transform.y,
		left: moveStartPos.left + transform.x
	});
	const onMoveStart = (e: MouseEvent | TouchEvent) => {
		gridInfo = getGridCellInfo(gridWrapper);
		moveStartPos = { top, left };
		transform = { x: 0, y: 0 };
		moveStartCoord = getEventCoords(e);
		moveStartTime = timeBlock.start;
		blocktDay.snapshotBlocks();
		pageState.draggingBlock = timeBlock.id;
		addMoveListeners();
	};
	const onMove = (e: MouseEvent | TouchEvent) => {
		const { x, y } = getEventCoords(e);
		transform.x = x - moveStartCoord.x;
		const dy = y - moveStartCoord.y;
		transform.y = dy;
		const blockShift = Math.round(dy / gridInfo!.cellHeight);
		const timeShift = blockShift * blocktDay.day.blockSizeHours;
		const newStart = moveStartTime + timeShift;
		if (newStart !== timeBlock.start) {
			blocktDay.moveBlock(timeBlock.id, newStart);
		}
		printBlocksTestFormat(blocktDay.day.blocks);
	};
	const onMoveStop = (e: MouseEvent | TouchEvent) => {
		pageState.draggingBlock = '';
		removeMoveListeners();
	};
	const addMoveListeners = () => {
		document.addEventListener('mousemove', onMove);
		document.addEventListener('touchmove', onMove, { passive: false });
		document.addEventListener('mouseup', onMoveStop);
		document.addEventListener('touchend', onMoveStop);
	};
	const removeMoveListeners = () => {
		document.removeEventListener('mousemove', onMove);
		document.removeEventListener('touchmove', onMove);
		document.removeEventListener('mouseup', onMoveStop);
		document.removeEventListener('touchend', onMoveStop);
	};
</script>

{#snippet handle(side: 'top' | 'bottom')}
	<button
		class={`absolute left-0 right-0 h-2 w-full cursor-ns-resize rounded-full ${pageState.draggingEdge ? '' : 'hover:bg-black hover:bg-opacity-10'} ${side}-0 ${extendSide === side ? 'bg-black bg-opacity-10' : ''}`}
		aria-label="Resize"
		onmousedown={onEdgeStart}
		ontouchstart={onEdgeStart}
		data-side={side}
	></button>
{/snippet}

<button
	class={`absolute z-10 cursor-pointer rounded-sm ${pageState.draggingBlock === timeBlock.id ? 'z-20' : 'transition-all duration-75'}`}
	style:background={timeBlock.color}
	id={timeBlock.id}
	style:top={(pageState.draggingBlock === timeBlock.id ? blockPos.top : top) + 'px'}
	style:left={(pageState.draggingBlock === timeBlock.id ? blockPos.left : left) + 'px'}
	style:width={width + 'px'}
	style:height={height + 'px'}
	transition:scale={{ duration: 200, easing: quartInOut }}
	onmousedown={onMoveStart}
	ontouchstart={onMoveStart}
>
	{@render handle('top')}
	<span class="small ml-4">
		{timeBlock.task}
	</span>
	{@render handle('bottom')}
</button>

<div
	class="absolute z-0 rounded-sm border border-dashed border-slate-400 transition-all duration-75"
	style:top={top + placeholderPadding + 'px'}
	style:left={left + placeholderPadding + 'px'}
	style:width={width - 2 * placeholderPadding + 'px'}
	style:height={height - 2 * placeholderPadding + 'px'}
></div>
