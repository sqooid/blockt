<script lang="ts">
	import { hourToReadable } from './types.svelte';

	type Props = {
		top: number | null;
		hour: number;
	};
	let { top, hour }: Props = $props();
</script>

{#if top !== null}
	<div class="pointer-events-none absolute z-10 w-full" style:top={`${top}px`}>
		<span
			class="bar text- muted absolute z-10 block -translate-y-1/2 rounded-md border bg-background p-[1px] opacity-100 shadow-sm"
		>
			{hourToReadable(hour)}
		</span>
		<div class="bar h-[3px] -translate-y-1/2 rounded-full bg-primary opacity-30 shadow-sm"></div>
	</div>
{/if}

<style lang="postcss">
</style>
