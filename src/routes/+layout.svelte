<script>
	import { browser, dev } from '$app/environment';
	import { page } from '$app/stores';
	import { pageState } from '$lib/components/blocker/types.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Cog, Info } from 'lucide-svelte';
	import { setContext } from 'svelte';
	import '../app.css';
	import '../typography.css';
	import { defaultConfig, localStore } from '$lib/components/config.svelte';
	//@ts-ignore
	import { pwaInfo } from 'virtual:pwa-info';
	import Rows_3 from 'lucide-svelte/icons/rows-3';
	let { children } = $props();

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	const config = localStore('config', defaultConfig);
	setContext('config', config.value);

	const visited = localStore('visited', false);
	setContext('visited', visited);

	if (browser && !dev) {
		console.log = () => {};
		console.warn = () => {};
		console.info = () => {};
		console.debug = () => {};
	}
</script>

<svelte:head>
	{@html webManifestLink}
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Toaster />
<div class="font-poppins flex w-full flex-col items-center">
	<div class="grid w-full grid-cols-3 border-b border-muted">
		<div class="ml-8 self-center justify-self-start">
			{#if $page.url.pathname === '/'}
				<Button variant="outline" href="/about">
					<Info class="h-6 w-6" />
				</Button>
			{:else}
				<Button variant="outline" href="/">
					<Rows_3 class="h-6 w-6" />
				</Button>
			{/if}
		</div>
		<h1 class="h1 mx-auto py-4">Blockt</h1>
		<div
			class={`mr-8 self-center justify-self-end ${$page.url.pathname === '/' ? '' : 'invisible'}`}
		>
			<Button variant="outline" on:click={() => (pageState.showConfig = !pageState.showConfig)}>
				<Cog class="h-6 w-6" />
			</Button>
		</div>
	</div>
	{#if !visited.value}
		<Button variant="ghost" class="mt-2" href="/about">What's this?</Button>
	{/if}
	{@render children()}
</div>
