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

export const createBlocktDay = (block: DayBlock) => {
	let day = $state(block);
	const setData = (data: DayBlock) => {
		day = data;
	};
	const getInsertIndex = (newBlock: TimeBlock) => {
		if (day.blocks.length == 0) return 0;
		if (newBlock.end <= day.blocks[0].start && newBlock.start >= day.startHour) return 0;
		for (let i = 0; i < day.blocks.length - 1; i++) {
			const block = day.blocks[i];
			const nextBlock = day.blocks[i + 1];
			if (newBlock.start >= block.end && newBlock.end <= nextBlock.start) {
				return i;
			}
		}
		if (newBlock.start >= day.blocks[day.blocks.length - 1].end && newBlock.end <= day.endHour)
			return day.blocks.length;
		return -1;
	};
	const addBlock = (block: TimeBlock) => {
		if (block.start < day.startHour || block.end > day.endHour) return false;
		if (block.start >= block.end) return false;
		const insertIndex = getInsertIndex(block);
		if (insertIndex != -1) {
			day.blocks.splice(insertIndex, 0, block);
			return true;
		}
		return false;
	};
	return { day, setData, addBlock };
};

export type BlocktDay = ReturnType<typeof createBlocktDay>;

export const currentBlocktDay = createBlocktDay({
	startHour: 7,
	endHour: 22,
	blockSizeHours: 1,
	date: new Date(),
	blocks: []
});
