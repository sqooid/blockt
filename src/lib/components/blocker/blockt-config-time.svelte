<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { type Selected } from 'bits-ui';
	import { range } from 'lodash-es';
	import { hourToReadable } from './types.svelte';

	type Props = {
		value: number;
		min: number;
		max: number;
		step: number;
	};
	let { value = $bindable(), min, max, step }: Props = $props();

	const onChange = (selected: Selected<number> | undefined) => {
		if (selected) {
			value = selected.value;
		}
	};
	const values = $derived(range(min, max, step));
</script>

<Select.Root onSelectedChange={onChange} selected={{ value, label: hourToReadable(value, false) }}>
	<Select.Trigger>
		<Select.Value placeholder="Time" />
	</Select.Trigger>
	<Select.Content class="max-h-64 overflow-auto">
		{#each values as v}
			<Select.Item value={v}>{hourToReadable(v, false)}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
