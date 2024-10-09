<script lang="ts">
	import Blocker from '$lib/components/blocker/blocker.svelte';
	import { BlocktDay, type DayBlock } from '$lib/components/blocker/types.svelte';
	import moment from 'moment';

	const emptyDayBlock: DayBlock = {
		date: moment().startOf('day').toDate(),
		blocks: [],
		startHour: 9,
		endHour: 22,
		blockSizeHours: 0.5
	};
	const blocktDay = BlocktDay.fromDayBlock(emptyDayBlock);
</script>

<div class="w-full p-8">
	<Blocker {blocktDay} />
</div>
