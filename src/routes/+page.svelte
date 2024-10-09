<script lang="ts">
	import { browser } from '$app/environment';
	import Blocker from '$lib/components/blocker/blocker.svelte';
	import { BlocktDay, type DayBlock } from '$lib/components/blocker/types.svelte';
	import moment from 'moment';

	let initDay: DayBlock = {
		date: moment().startOf('day').toDate(),
		blocks: [],
		startHour: 9,
		endHour: 22,
		blockSizeHours: 0.5
	};
	if (browser) {
		const storedDay = localStorage.getItem('blocktDay');
		if (storedDay) {
			initDay = JSON.parse(storedDay);
			initDay.date = new Date(initDay.date);
		}
	}
	const blocktDay = BlocktDay.fromDayBlock(initDay);

	$effect(() => {
		const day = blocktDay.day;
		if (browser) {
			localStorage.setItem('blocktDay', JSON.stringify(day));
		}
	});
</script>

<div class="w-full p-8">
	<Blocker {blocktDay} />
</div>
