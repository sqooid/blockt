<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from '../ui/button';
	import Card from '../ui/card/card.svelte';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import type { BlocktDay, TimeBlock } from './types.svelte';
	import { scale } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { v4 } from 'uuid';

	type Props = {
		show: boolean;
		blocktDay: BlocktDay;
		hour: number;
	};
	let { show = $bindable(), blocktDay, hour }: Props = $props();

	$effect(() => {
		if (show) {
			document.addEventListener('click', onClickDoc);
		} else {
			document.removeEventListener('click', onClickDoc);
		}
	});

	let wasShow = false; // fuuuuuuuuuck me
	const onClickDoc = (e: MouseEvent) => {
		if (show && wasShow && mainElem && !mainElem.contains(e.target as Node)) {
			onSave();
		}
		wasShow = show;
	};

	const close = () => {
		show = false;
		wasShow = false;
	};

	let task = $state('');
	const onSave = () => {
		if (task) {
			const newBlock: TimeBlock = {
				id: v4(),
				start: hour,
				end: hour + blocktDay.day.blockSizeHours,
				task: task,
				color: ''
			};
			const res = blocktDay.addBlock(newBlock);
			if (!res) toast.error('Task overlaps with existing task');
		}
		close();
	};

	const onCancel = () => {
		close();
	};

	let mainElem = $state<HTMLDivElement | null>(null);
	let bottom = $derived((mainElem?.getBoundingClientRect().top ?? 1) < 0);
	let ready = $derived(mainElem);
	const wrapperClass = $derived(
		bottom ? 'bottom-2 translate-y-[100%]' : '-top-2 -translate-y-[100%]'
	);
	$effect(() => console.log(mainElem?.getBoundingClientRect().top));
</script>

{#if show}
	<div
		class={`absolute z-10 w-[80vw] max-w-prose ${wrapperClass}`}
		bind:this={mainElem}
		transition:scale={{ duration: 150, easing: backInOut }}
	>
		<Card class="flex flex-col gap-2 p-4 shadow-md">
			<Label>
				<span>Task</span>
				<Input type="text" placeholder="e.g. Walk" bind:value={task} class="mt-1" />
			</Label>
			<div class="flex gap-2">
				<Button variant="outline" class="w-fit" onclick={onCancel}>Cancel</Button>
				<Button class="w-fit" onclick={onSave}>Add</Button>
			</div>
		</Card>
	</div>
{/if}
