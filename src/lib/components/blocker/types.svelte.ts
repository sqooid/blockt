import moment from 'moment';

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

	constructor(dayBlock: DayBlock) {
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

	addBlock(block: TimeBlock) {
		const day = this.#day;
		if (block.start < day.startHour || block.end > day.endHour) return false;
		if (block.start >= block.end) return false;
		let insertIndex = -1;
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].end <= block.start) {
				insertIndex = i;
			}
		}
		console.log(insertIndex);

		const nextBlock = this.blocks[insertIndex + 1];
		if (nextBlock && block.end > nextBlock.start) return false;
		this.blocks.splice(insertIndex + 1, 0, block);
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
		console.log(limit);

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
}

type GridCellInfo = {
	top: number;
	pageTop: number;
	pageBottom: number;
};
export type GridInfo = {
	leftOffset: number;
	cellHeight: number;
	cells: GridCellInfo[];
};
export const getGridCellInfo = (wrapper: HTMLElement | null) => {
	if (!wrapper) return null;
	const gridInfo: GridInfo = { leftOffset: 0, cellHeight: 0, cells: [] };
	wrapper.querySelectorAll('.blockt-cell').forEach((cell, i) => {
		const c = cell as HTMLElement;
		if (i === 0) {
			gridInfo.leftOffset = c.offsetLeft;
			gridInfo.cellHeight = c.offsetHeight;
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
	dragging = $state(false);
}
export const pageState = new PageState();

export const blockColours = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];

export const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
