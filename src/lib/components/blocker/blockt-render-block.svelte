<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { TimeBlock } from './types.svelte';
	import { backInOut, quartInOut } from 'svelte/easing';

	type Props = {
		top: number;
		left: number;
		right: number;
		height: number;
		timeBlock: TimeBlock;
	};
	let { top, left, right, height, timeBlock }: Props = $props();
</script>

<div
	class="absolute rounded-sm bg-black bg-opacity-10 px-4"
	id={timeBlock.id}
	style:top={top + 'px'}
	style:left={left + 'px'}
	style:right={right + 'px'}
	style:height={height + 'px'}
	transition:scale={{ duration: 200, easing: quartInOut }}
>
	<span class="small">
		{timeBlock.task}
	</span>
</div>
