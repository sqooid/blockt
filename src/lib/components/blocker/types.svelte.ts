import moment from 'moment';
import { cloneDeep } from 'lodash-es';
import { browser } from '$app/environment';

export type DayBlock = {
	date: Date;
	startHour: number;
	endHour: number;
	blockSizeHours: number;
	blocks: TimeBlock[];
};

export type TimeBlock = {
	id: string;
	task: string;
	start: number;
	end: number;
	color: string;
};

export const hourToReadable = (hour: number, wrap = true): string => {
	const minutes = (hour % 1) * 60;
	const hourFloor = Math.floor(hour);
	const hours = wrap ? (hourFloor == 12 ? 12 : hourFloor % 12) : hourFloor;
	return `${hours}:${minutes || '00'}`;
};

const defaultDayBlock: DayBlock = {
	startHour: 7,
	endHour: 22,
	blockSizeHours: 0.5,
	blocks: [],
	date: moment().startOf('day').toDate()
};

export class BlocktDay {
	#day = $state<DayBlock>(defaultDayBlock);
	#blocksSnapshot: TimeBlock[] = [];

	static fromDayBlock(dayBlock: DayBlock) {
		const blocktDay = new BlocktDay(dayBlock);
		return blocktDay;
	}

	constructor(dayBlock = defaultDayBlock) {
		this.#day = dayBlock;
	}

	test() {
		this.#day = defaultDayBlock;
	}

	get day() {
		return this.#day;
	}

	get blocks() {
		return this.#day.blocks;
	}

	getInsertIndex(block: TimeBlock) {
		let insertIndex = -1;
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].end <= block.start) {
				insertIndex = i;
			}
		}
		return insertIndex + 1;
	}

	addBlock(block: TimeBlock) {
		const day = this.#day;
		if (block.start < day.startHour || block.end > day.endHour) return false;
		if (block.start >= block.end) return false;
		const insertIndex = this.getInsertIndex(block);

		if (this.blocks.some((b) => BlocktDay.blockOverlap(b, block))) return false;

		this.blocks.splice(insertIndex, 0, block);
		return true;
	}

	moveBlockEnd(blockId: string, newEnd: number) {
		const blockIdx = this.blocks.findIndex((b) => b.id == blockId);
		if (blockIdx < 0) return false;
		const block = this.blocks[blockIdx];
		if (newEnd <= block.start) return false;
		// find extension limit
		const nextBlock = this.blocks[blockIdx + 1];
		const limit = nextBlock ? nextBlock.start : this.#day.endHour;

		const newEndHour = Math.min(newEnd, limit);
		block.end = newEndHour;
		return true;
	}

	moveBlockStart(blockId: string, newStart: number) {
		const blockIdx = this.blocks.findIndex((b) => b.id == blockId);
		if (blockIdx < 0) return false;
		const block = this.blocks[blockIdx];
		if (newStart >= block.end) return false;
		// find extension limit
		const prevBlock = this.blocks[blockIdx - 1];
		const limit = prevBlock ? prevBlock.end : this.#day.startHour;
		const newStartHour = Math.max(newStart, limit);
		block.start = newStartHour;
		return true;
	}

	snapshotBlocks() {
		// This gets deepcloned by move
		this.#blocksSnapshot = [...$state.snapshot(this.blocks)];
	}

	static blockOverlap(block1: TimeBlock, block2: TimeBlock) {
		return (
			(block1.start < block2.end && block1.end > block2.start) ||
			(block2.start < block1.end && block2.end > block1.start)
		);
	}

	static compressBlocks(blocks: TimeBlock[], side: 'top' | 'bottom') {
		let cost = 0;
		if (side === 'top') {
			for (let i = 0; i < blocks.length - 1; i++) {
				const b1 = blocks[i];
				const b2 = blocks[i + 1];
				const shift = b2.start - b1.end;
				b2.start -= shift;
				b2.end -= shift;
				cost += shift;
			}
		} else {
			for (let i = blocks.length - 1; i > 0; i--) {
				const b1 = blocks[i];
				const b2 = blocks[i - 1];
				const shift = b1.start - b2.end;
				b2.start += shift;
				b2.end += shift;
				cost += shift;
			}
		}
		return cost;
	}

	static blocksSpan(blocks: TimeBlock[]) {
		if (blocks.length === 0) return 0;
		return blocks[blocks.length - 1].end - blocks[0].start;
	}

	moveBlock(blockId: string, newStart: number) {
		// must run snapshotBlocks before this at least once
		const blocks = cloneDeep(this.#blocksSnapshot);
		const blockIdx = blocks.findIndex((b) => b.id == blockId);
		// proposed position
		const block = blocks.splice(blockIdx, 1)[0];
		// clamp start within bounds
		newStart = Math.max(
			this.#day.startHour,
			Math.min(this.#day.endHour - (block.end - block.start), newStart)
		);
		const newBlock = { ...block, start: newStart, end: block.end + newStart - block.start };

		// get overlaps
		const overlaps = blocks.filter((b) => BlocktDay.blockOverlap(b, newBlock));
		// iterate over combinations of possible movements to find cheapest
		let bestCost = Infinity;
		let bestDepth = Infinity;
		let bestBlocks = blocks;
		for (let i = 0; i < overlaps.length + 1; i++) {
			let cost = 0;
			let depth = 0;
			const up = overlaps.slice(0, i);
			const proposedBlocks = cloneDeep(blocks);
			if (up.length > 0) {
				const refBlock = up[up.length - 1];
				const shift = newBlock.start - refBlock.end; // negative shift expected
				const upIndex = proposedBlocks.findIndex((b) => b.id == refBlock.id);
				const res = this.shiftBlock(proposedBlocks, upIndex, shift);
				cost += res.cost;
				depth += res.depth;
			}
			const down = overlaps.slice(i);
			if (down.length > 0) {
				const refBlock = down[0];
				const shift = newBlock.end - refBlock.start; // negative shift expected
				const downIndex = proposedBlocks.findIndex((b) => b.id == refBlock.id);
				const res = this.shiftBlock(proposedBlocks, downIndex, shift);
				cost += res.cost;
				depth += res.depth;
			}
			if (cost < bestCost) {
				bestCost = cost;
				bestDepth = depth;
				bestBlocks = proposedBlocks;
			} else if (cost === bestCost && depth < bestDepth) {
				bestDepth = depth;
				bestBlocks = proposedBlocks;
			}
		}
		this.#day.blocks = bestBlocks;
		this.addBlock(newBlock);
	}

	shiftBlock(
		blocks: TimeBlock[],
		blockIdx: number,
		shift: number,
		depth = 0
	): { cost: number; depth: number } {
		if (shift === 0) return { cost: 0, depth };
		const block = blocks[blockIdx];
		block.start += shift;
		block.end += shift;
		if (block.start < this.#day.startHour || block.end > this.#day.endHour)
			return { cost: NaN, depth };
		const nextIdx = shift > 0 ? blockIdx + 1 : blockIdx - 1;
		const nextBlock = blocks[nextIdx];
		const shiftNeeded = nextBlock
			? shift > 0
				? nextBlock.start < block.end
				: nextBlock.end > block.start
			: false;
		if (!shiftNeeded) return { cost: Math.abs(shift), depth: depth + 1 };
		const nextShift = shift < 0 ? block.start - nextBlock.end : block.end - nextBlock.start;
		const nextResult = this.shiftBlock(blocks, nextIdx, nextShift, depth + 1);
		return { cost: Math.abs(shift) + nextResult.cost, depth: nextResult.depth };
	}
}

export const printBlocksTestFormat = (blocks: TimeBlock[]) => {
	const b = blocks.map((b, i) => ({
		id: i.toString(),
		start: b.start,
		end: b.end,
		color: '',
		task: ''
	}));
	console.log(JSON.stringify(b));
};

type GridCellInfo = {
	top: number;
	pageTop: number;
	pageBottom: number;
};
export type GridInfo = {
	leftOffset: number;
	cellHeight: number;
	cellWidth: number;
	gridTop: number;
	gridLeft: number;
	cells: GridCellInfo[];
};
export const getGridCellInfo = (wrapper: HTMLElement | null) => {
	if (!wrapper) return null;
	const wrapperBbox = wrapper.getBoundingClientRect();
	const gridInfo: GridInfo = {
		leftOffset: 0,
		cellHeight: 0,
		cellWidth: 0,
		gridLeft: wrapperBbox.left + window.scrollX,
		gridTop: wrapperBbox.top + window.scrollY,
		cells: []
	};
	wrapper.querySelectorAll('.blockt-cell').forEach((cell, i) => {
		const c = cell as HTMLElement;
		if (i === 0) {
			gridInfo.leftOffset = c.offsetLeft;
			gridInfo.cellHeight = c.offsetHeight;
			gridInfo.cellWidth = c.offsetWidth;
		}
		const bbox = c.getBoundingClientRect();
		const cellItem: GridCellInfo = {
			top: c.offsetTop,
			pageTop: bbox.top + window.scrollY,
			pageBottom: bbox.bottom + window.scrollY
		};
		gridInfo.cells.push(cellItem);
	});
	return gridInfo;
};

class PageState {
	draggingEdge = $state(false);
	draggingBlock = $state('');
	showConfig = $state(false);
}
export const pageState = new PageState();

export const blockColours = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];

export const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

class RecentBlocks {
	#blocks: { task: string; color: string }[] = $state([]);
	#limit: number;

	constructor(limit?: number) {
		this.#limit = limit ?? 5;
		if (browser) {
			const recentBlocks = localStorage.getItem('recentBlocks');
			if (recentBlocks) {
				this.#blocks = JSON.parse(recentBlocks);
			}
		}
	}

	get blocks() {
		return this.#blocks;
	}

	addBlock(task: string, color: string) {
		const block = { task, color };
		this.#blocks = [block, ...this.#blocks.filter((b) => b.task !== task)].slice(0, 5);
		if (browser) {
			localStorage.setItem('recentBlocks', JSON.stringify(this.#blocks));
		}
	}
}

export const recentBlocks = new RecentBlocks();
