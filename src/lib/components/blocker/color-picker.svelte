<script lang="ts">
	import { blockColours } from './types.svelte';

	type Props = {
		value: string;
	};
	let { value = $bindable() }: Props = $props();
</script>

<div class="flex gap-2">
	{#each blockColours as c}
		<button
			class={`h-5 w-5 rounded-sm ${value === c ? 'outline outline-2 outline-offset-1 outline-slate-500' : ''}`}
			style:background={c}
			aria-label="color"
			onclick={() => (value = c)}
		></button>
	{/each}
</div>
