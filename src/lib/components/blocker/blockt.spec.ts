import { expect, test } from 'vitest';
import { BlocktDay, type DayBlock, type TimeBlock } from './types.svelte';

test('blockt consecutive block', async () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	const newBlock1: TimeBlock = {
		id: 'block1',
		task: 'task1',
		start: 7,
		end: 7.5,
		color: 'red'
	};
	let res = day.addBlock(newBlock1);
	expect(res).toBe(true);

	const newBlock2: TimeBlock = {
		id: 'block2',
		task: 'task2',
		start: 7.5,
		end: 8,
		color: 'red'
	};
	res = day.addBlock(newBlock2);
	expect(res).toBe(true);
});

test('blockt out of day block', async () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	const newBlock1: TimeBlock = {
		id: 'block1',
		task: 'task1',
		start: 7,
		end: 7.5,
		color: 'red'
	};
	let res = day.addBlock(newBlock1);
	expect(res).toBe(true);

	const newBlock2: TimeBlock = {
		id: 'block2',
		task: 'task2',
		start: 6.5,
		end: 7,
		color: 'red'
	};
	res = day.addBlock(newBlock2);
	expect(res).toBe(false);

	const newBlock3: TimeBlock = {
		id: 'block3',
		task: 'task3',
		start: 21,
		end: 22.5,
		color: 'red'
	};
	res = day.addBlock(newBlock3);
	expect(res).toBe(false);
});

test('blockt overlapping block', async () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	const newBlock1: TimeBlock = {
		id: 'block1',
		task: 'task1',
		start: 8,
		end: 9,
		color: 'red'
	};
	let res = day.addBlock(newBlock1);
	expect(res).toBe(true);

	const newBlock2: TimeBlock = {
		id: 'block2',
		task: 'task2',
		start: 8.5,
		end: 9.5,
		color: 'red'
	};
	res = day.addBlock(newBlock2);
	expect(res).toBe(false);

	const newBlock3: TimeBlock = {
		id: 'block3',
		task: 'task3',
		start: 7.5,
		end: 8.5,
		color: 'red'
	};
	res = day.addBlock(newBlock3);
	expect(res).toBe(false);
});

test('blockt contained block', async () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	const newBlock1: TimeBlock = {
		id: 'block1',
		task: 'task1',
		start: 8,
		end: 9,
		color: 'red'
	};
	let res = day.addBlock(newBlock1);
	expect(res).toBe(true);

	const newBlock2: TimeBlock = {
		id: 'block2',
		task: 'task2',
		start: 7,
		end: 9.5,
		color: 'red'
	};
	res = day.addBlock(newBlock2);
	expect(res).toBe(false);
});

test('blockt insert order', async () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	const newBlock1: TimeBlock = {
		id: 'block1',
		task: 'task1',
		start: 9,
		end: 9.5,
		color: 'red'
	};
	let res = day.addBlock(newBlock1);

	const newBlock2: TimeBlock = {
		id: 'block2',
		task: 'task2',
		start: 10.5,
		end: 11,
		color: 'red'
	};
	res = day.addBlock(newBlock2);

	const newBlock3: TimeBlock = {
		id: 'block3',
		task: 'task3',
		start: 9.5,
		end: 10,
		color: 'red'
	};
	res = day.addBlock(newBlock3);

	expect(day.blocks[0].id).toBe('block1');
	expect(day.blocks[1].id).toBe('block3');
	expect(day.blocks[2].id).toBe('block2');
});

const fastBlock = (start: number, end: number, id: string): TimeBlock => {
	return { id, start, end, color: '', task: '' };
};

test('compress top', () => {
	const blocks: TimeBlock[] = [
		fastBlock(9, 9.5, '1'),
		fastBlock(10, 10.5, '2'),
		fastBlock(11.5, 12, '3')
	];
	const cost = BlocktDay.compressBlocks(blocks, 'top');
	const r = blocks;
	expect(cost).toBe(2);
	expect(r[0].start).toBe(9);
	expect(r[0].end).toBe(9.5);
	expect(r[1].start).toBe(9.5);
	expect(r[1].end).toBe(10);
	expect(r[2].start).toBe(10);
	expect(r[2].end).toBe(10.5);
});

test('compress bottom', () => {
	const blocks: TimeBlock[] = [
		fastBlock(9, 9.5, '1'),
		fastBlock(10, 10.5, '2'),
		fastBlock(11.5, 12, '3')
	];
	const cost = BlocktDay.compressBlocks(blocks, 'bottom');
	const r = blocks;
	expect(cost).toBe(2.5);
	expect(r[2].start).toBe(11.5);
	expect(r[2].end).toBe(12);
	expect(r[1].start).toBe(11);
	expect(r[1].end).toBe(11.5);
	expect(r[0].start).toBe(10.5);
	expect(r[0].end).toBe(11);
});

test('shift blocks up', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);
	const blocks: TimeBlock[] = [
		fastBlock(9, 9.5, '1'),
		fastBlock(10, 10.5, '2'),
		fastBlock(11.5, 12, '3')
	];
	const { cost, depth } = day.shiftBlock(blocks, 2, -3);
	expect(depth).toBe(3);
	expect(cost).toBe(6.5);
	expect(blocks[2].start).toBe(8.5);
	expect(blocks[2].end).toBe(9);
	expect(blocks[1].start).toBe(8);
	expect(blocks[1].end).toBe(8.5);
	expect(blocks[0].start).toBe(7.5);
	expect(blocks[0].end).toBe(8);
});

test('shift blocks up no space', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);
	const blocks: TimeBlock[] = [
		fastBlock(9, 9.5, '1'),
		fastBlock(10, 10.5, '2'),
		fastBlock(11.5, 12, '3')
	];
	const { cost, depth } = day.shiftBlock(blocks, 2, -4);
	expect(cost).toBeNaN();
});

test('shift blocks down', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);
	const blocks: TimeBlock[] = [
		fastBlock(9, 9.5, '1'),
		fastBlock(10, 10.5, '2'),
		fastBlock(11.5, 12, '3'),
		fastBlock(13.5, 12, '4')
	];
	const { cost, depth } = day.shiftBlock(blocks, 0, 3);
	expect(depth).toBe(3);
	expect(cost).toBe(7);
	expect(blocks[0].start).toBe(12);
	expect(blocks[0].end).toBe(12.5);
	expect(blocks[1].start).toBe(12.5);
	expect(blocks[1].end).toBe(13);
	expect(blocks[2].start).toBe(13);
	expect(blocks[2].end).toBe(13.5);
});

test('shift blocks down no space', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);
	const blocks: TimeBlock[] = [
		fastBlock(9, 9.5, '1'),
		fastBlock(10, 10.5, '2'),
		fastBlock(11.5, 12, '3')
	];
	const { cost, depth } = day.shiftBlock(blocks, 0, 12);
	expect(cost).toBeNaN();
});

test('blockt move block simple', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	const block1: TimeBlock = {
		id: 'block1',
		task: 'task1',
		start: 9,
		end: 10,
		color: 'red'
	};
	day.addBlock(block1);
	day.snapshotBlocks();

	day.moveBlock('block1', 8.5);
	expect(day.blocks[0].start).toBe(8.5);
	day.moveBlock('block1', 9.5);
	expect(day.blocks[0].start).toBe(9.5);
});

test('blockt move small displace large', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	day.addBlock(fastBlock(10, 10.5, '1'));
	day.addBlock(fastBlock(10.5, 11.5, '2'));
	day.addBlock(fastBlock(11.5, 12.5, '3'));
	day.snapshotBlocks();

	day.moveBlock('1', 10.5);
	expect(day.blocks[0].start).toBe(9.5);
	expect(day.blocks[0].id).toBe('2');
	expect(day.blocks[1].start).toBe(10.5);
	expect(day.blocks[1].id).toBe('1');
	expect(day.blocks[2].start).toBe(11.5);
	expect(day.blocks[2].id).toBe('3');

	day.moveBlock('1', 10.5);
});

test('blockt move small displace large start limit', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	day.addBlock(fastBlock(7, 7.5, '1'));
	day.addBlock(fastBlock(7.5, 8.5, '2'));
	day.addBlock(fastBlock(8.5, 9.5, '3'));
	day.snapshotBlocks();

	day.moveBlock('1', 7.5);
	expect(day.blocks[0].start).toBe(7.5);
	expect(day.blocks[0].id).toBe('1');
	expect(day.blocks[1].start).toBe(8);
	expect(day.blocks[1].id).toBe('2');
	expect(day.blocks[2].start).toBe(9);
	expect(day.blocks[2].id).toBe('3');
});

test('blockt move large displace small', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);

	day.addBlock(fastBlock(7, 10, '1'));
	day.addBlock(fastBlock(10, 10.5, '2'));
	day.addBlock(fastBlock(10.5, 11, '3'));
	day.addBlock(fastBlock(11, 12, '4'));
	day.snapshotBlocks();

	day.moveBlock('1', 10);
	expect(day.blocks).toMatchObject([
		{ id: '2', start: 9, end: 9.5 },
		{ id: '3', start: 9.5, end: 10 },
		{ id: '1', start: 10, end: 13 },
		{ id: '4', start: 13, end: 14 }
	]);
});

test('blockt weird small displacement', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);
	day.day.blocks = [
		{
			id: '1',
			start: 10,
			end: 10.5,
			task: 'asdasda',
			color: '#ffffba'
		},
		{
			id: '2',
			start: 12,
			end: 15,
			task: 'asdsd',
			color: '#baffc9'
		},
		{
			id: '3',
			start: 15,
			end: 15.5,
			task: 'asd',
			color: '#baffc9'
		}
	];

	day.snapshotBlocks();

	day.moveBlock('3', 14.5);
	expect(day.blocks).toMatchObject([
		{ id: '1', start: 10, end: 10.5 },
		{ id: '2', start: 11.5, end: 14.5 },
		{ id: '3', start: 14.5, end: 15 }
	]);
});

test('blockt weird small displacement 2', () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);
	day.day.blocks = [
		{ id: '0', start: 10, end: 10.5, color: '', task: '' },
		{ id: '1', start: 11.5, end: 12.5, color: '', task: '' },
		{ id: '2', start: 12.5, end: 13, color: '', task: '' }
	];

	day.snapshotBlocks();

	day.moveBlock('2', 12);
	expect(day.blocks).toMatchObject([
		{ id: '0', start: 10, end: 10.5, color: '', task: '' },
		{ id: '1', start: 11, end: 12, color: '', task: '' },
		{ id: '2', start: 12, end: 12.5, color: '', task: '' }
	]);
});

test('blockt disappearing block', () => {
	const dayBlock: DayBlock = {
		startHour: 9,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = BlocktDay.fromDayBlock(dayBlock);
	day.day.blocks = [
		{ id: '0', start: 10.5, end: 11.5, color: '', task: '' },
		{ id: '1', start: 11.5, end: 14, color: '', task: '' },
		{ id: '2', start: 14, end: 16, color: '', task: '' },
		{ id: '3', start: 16, end: 22, color: '', task: '' }
	];

	day.snapshotBlocks();

	day.moveBlock('0', 11);
	expect(day.blocks).toMatchObject([
		{ id: '0', start: 10.5, end: 11.5, color: '', task: '' },
		{ id: '1', start: 11.5, end: 14, color: '', task: '' },
		{ id: '2', start: 14, end: 16, color: '', task: '' },
		{ id: '3', start: 16, end: 22, color: '', task: '' }
	]);
});
