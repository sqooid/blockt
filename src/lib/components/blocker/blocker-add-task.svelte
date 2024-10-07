<script lang="ts">
	import Card from '../ui/card/card.svelte';

	type Props = {
		show: boolean;
	};
	let { show = $bindable() }: Props = $props();

	let addElem: HTMLDivElement | null;

	$effect(() => {
		if (show) {
			document.addEventListener('click', onClickDoc);
		} else {
			document.removeEventListener('click', onClickDoc);
		}
	});

	let wasShow = false; // fuuuuuuuuuck me
	const onClickDoc = (e: MouseEvent) => {
		console.log(show, wasShow);

		if (show && wasShow && addElem && !addElem.contains(e.target as Node)) {
			show = false;
		}
		wasShow = show;
	};
</script>

{#if show}
	<div class="absolute z-10 w-[80vw] max-w-prose" bind:this={addElem}>
		<Card class="p-4">blahblah</Card>
	</div>
{/if}
