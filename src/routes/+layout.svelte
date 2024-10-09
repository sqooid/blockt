<script>
	import '../app.css';
	import '../typography.css';
	import { Toaster } from '$lib/components/ui/sonner';

	//@ts-ignore
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<Toaster />
<div class="flex w-full flex-col items-center">
	<h1 class="h1 py-4">Blockt</h1>
	{@render children()}
</div>
