<script lang="ts">
	import { browser } from '$app/environment';
	import Blockt from '$lib/components/blocker/blocker.svelte';
	import BlocktConfig from '$lib/components/blocker/blockt-config.svelte';
	import { BlocktDay, pageState, type DayBlock } from '$lib/components/blocker/types.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';

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
	<div class="mx-auto mb-4 max-w-prose">
		<Collapsible.Root bind:open={pageState.showConfig}>
			<Collapsible.Content>
				<BlocktConfig {blocktDay} />
			</Collapsible.Content>
		</Collapsible.Root>
	</div>
	<Blockt {blocktDay} />
</div>
