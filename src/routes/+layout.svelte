<script>
	import '../app.css';
	import '../typography.css';
	import { Toaster } from '$lib/components/ui/sonner';

	//@ts-ignore
	import { pwaInfo } from 'virtual:pwa-info';
	import { Button } from '$lib/components/ui/button';
	import { Cog } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { pageState } from '$lib/components/blocker/types.svelte';

	let { children } = $props();

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<Toaster />
<div class="flex w-full flex-col items-center">
	<div class="grid w-full grid-cols-3 border-b border-muted">
		<div></div>
		<h1 class="h1 mx-auto py-4">Blockt</h1>
		<div
			class={`mr-8 self-center justify-self-end ${$page.url.pathname === '/' ? '' : 'invisible'}`}
		>
			<Button variant="outline" on:click={() => (pageState.showConfig = !pageState.showConfig)}>
				<Cog class="h-6 w-6" />
			</Button>
		</div>
	</div>
	{@render children()}
</div>
