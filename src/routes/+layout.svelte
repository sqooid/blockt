<script>
	import '../app.css';
	import '../typography.css';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<Toaster />
<div class="flex w-full flex-col items-center">
	<h1 class="h1 py-4">Blockt</h1>
	<slot></slot>
</div>
