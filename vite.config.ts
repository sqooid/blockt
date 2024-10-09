import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			devOptions: { enabled: true },
			injectRegister: 'auto',
			registerType: 'autoUpdate',
			// includeAssets: ['blockt.png', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
			manifest: {
				name: 'Blockt',
				short_name: 'Blockt',
				description: 'Dead simple no BS time blocker',
				theme_color: '#ffffff',
				icons: [
					{
						src: '/blockt.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
