<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { toast } from 'svelte-sonner';
	import { v4 } from 'uuid';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import { blockColours, randomChoice, type BlocktDay, type TimeBlock } from './types.svelte';
	import ColorPicker from './color-picker.svelte';

	type Props = {
		blocktDay: BlocktDay;
		hour: number;
		trigger: any;
	};
	let { blocktDay, hour, trigger }: Props = $props();

	let task = $state('');
	let color = $state(randomChoice(blockColours));
	const onSave = () => {
		if (task) {
			const newBlock: TimeBlock = {
				id: v4(),
				start: hour,
				end: hour + blocktDay.day.blockSizeHours,
				task: task,
				color: color
			};
			const res = blocktDay.addBlock(newBlock);
			if (!res) toast.error('Task overlaps with existing task');
		}
		open = false;
	};

	let open = $state(false);

	const onCancel = () => {
		open = false;
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		{@render trigger(builder, open)}
	</Popover.Trigger>
	<Popover.Content side="top" sideOffset={2}>
		<div class="flex flex-col gap-2">
			<Label>
				<span>Task</span>
				<Input type="text" placeholder="e.g. Walk" bind:value={task} class="mt-1" />
			</Label>
			<ColorPicker bind:value={color} />
			<div class="flex gap-2">
				<Button variant="outline" class="w-fit" onclick={onCancel}>Cancel</Button>
				<Button class="w-fit" onclick={onSave}>Add</Button>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
