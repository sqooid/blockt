<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { toast } from 'svelte-sonner';
	import { v4 } from 'uuid';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import {
		blockColours,
		randomChoice,
		recentBlocks,
		type BlocktDay,
		type TimeBlock
	} from './types.svelte';
	import ColorPicker from './color-picker.svelte';
	import { Badge } from '../ui/badge';
	import { Trash } from 'lucide-svelte';

	type Props = {
		blocktDay: BlocktDay;
		hour?: number;
		trigger: any;
		timeBlock?: TimeBlock;
		open?: boolean;
	};
	let { blocktDay, hour, trigger, timeBlock, open = $bindable() }: Props = $props();

	let task = $state(timeBlock?.task ?? '');
	let color = $state(timeBlock?.color ?? randomChoice(blockColours));
	const onSave = () => {
		if (!task) {
			toast.error('Task cannot be empty');
			return;
		}
		if (!timeBlock) {
			const newBlock: TimeBlock = {
				id: v4(),
				start: hour ?? 0,
				end: (hour ?? 0) + blocktDay.day.blockSizeHours,
				task: task,
				color: color
			};
			const res = blocktDay.addBlock(newBlock);
			if (!res) {
				toast.error('Task overlaps with existing task');
				return;
			}
		} else {
			timeBlock.task = task;
			timeBlock.color = color;
		}
		recentBlocks.addBlock(task, color);
		open = false;
	};

	const onCancel = () => {
		open = false;
	};

	const onClickRecent = (recent: { task: string; color: string }) => {
		task = recent.task;
		color = recent.color;
		onSave();
	};

	const onDelete = () => {
		blocktDay.deleteBlock(timeBlock!.id);
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		{@render trigger(builder, open)}
	</Popover.Trigger>
	<Popover.Content side="top" sideOffset={4}>
		<div class="flex flex-col gap-4">
			<Label>
				<span>Task</span>
				<Input type="text" placeholder="e.g. Walk" bind:value={task} class="mt-1" />
			</Label>
			<ColorPicker bind:value={color} />
			<div class="flex flex-wrap gap-2">
				{#each recentBlocks.blocks as recent (recent.task)}
					<Badge
						color={recent.color}
						class={`cursor-pointer text-foreground`}
						onclick={() => onClickRecent(recent)}>{recent.task}</Badge
					>
				{/each}
			</div>
			<div class="flex gap-2">
				{#if timeBlock}
					<Button variant="destructive" class="w-fit" onclick={onDelete}>
						<Trash class="h-4 w-4" />
					</Button>
				{/if}
				<Button variant="outline" class="w-fit" onclick={onCancel}>Cancel</Button>
				<Button class="w-fit" onclick={onSave}>{timeBlock ? 'Save' : 'Add'}</Button>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
