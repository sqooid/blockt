import { expect, test } from 'vitest';
import { createBlocktDay, type DayBlock, type TimeBlock } from './types.svelte';

test('blockt consecutive block', async () => {
	const dayBlock: DayBlock = {
		startHour: 7,
		endHour: 22,
		blockSizeHours: 0.5,
		blocks: [],
		date: new Date()
	};
	const day = createBlocktDay(dayBlock);

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
	const day = createBlocktDay(dayBlock);

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
	const day = createBlocktDay(dayBlock);

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
	const day = createBlocktDay(dayBlock);

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
