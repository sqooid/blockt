<script lang="ts">
	import { hourToReadable } from './types.svelte';

	type Props = {
		top: number | null;
		left: number | null;
		hour: number;
	};
	let { top, hour, left }: Props = $props();
</script>

{#if top !== null && left !== null}
	<div class="pointer-events-none absolute left-0 right-0" style:top={`${top}px`}>
		<div
			style:left={`${left - 6}px`}
			class="bar muted absolute z-40 -translate-x-full -translate-y-1/2 rounded-md border bg-background p-[1px] pl-[2px] opacity-100 shadow-sm"
		>
			{hourToReadable(hour)}
		</div>
		<div
			class="bar absolute right-0 z-30 h-[3px] -translate-y-1/2 rounded-full bg-primary opacity-30 shadow-sm"
			style:left={`${left - 10}px`}
		></div>
	</div>
{/if}
