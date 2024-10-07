export type DayBlock = {
	date: Date;
	startHour: number;
	endHour: number;
	blockSizeHours: number;
	blocks: TimeBlock[];
};

export type TimeBlock = {
	task: string;
	start: Date;
	end: Date;
};

export const hourToReadable = (hour: number, wrap = true): string => {
	const minutes = (hour % 1) * 60;
	const hourFloor = Math.floor(hour);
	const hours = wrap ? (hourFloor == 12 ? 12 : hourFloor % 12) : hourFloor;
	return `${hours}:${minutes || '00'}`;
};

export const createBlocktDay = (block: DayBlock) => {
	const day = $state(block);
	return { day };
};
