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
				],
				screenshots: [
					{
						sizes: '951x949',
						src: '/tutorial/example.png',
						form_factor: 'wide'
					},
					{
						sizes: '951x949',
						src: '/tutorial/image-1.png',
						form_factor: 'wide'
					},
					{
						sizes: '951x949',
						src: '/tutorial/image-2.png',
						form_factor: 'wide'
					},
					{
						sizes: '951x949',
						src: '/tutorial/image-3.png',
						form_factor: 'wide'
					},
					{
						sizes: '951x949',
						src: '/tutorial/image-4.png',
						form_factor: 'wide'
					},
					{
						sizes: '951x949',
						src: '/tutorial/image-5.png',
						form_factor: 'wide'
					},
					{
						sizes: '951x949',
						src: '/tutorial/image-6.png',
						form_factor: 'wide'
					},
					{
						sizes: '1080x2280',
						src: '/mobile/image-1.jpg',
						form_factor: 'narrow'
					},
					{
						sizes: '1080x2280',
						src: '/mobile/image-2.jpg',
						form_factor: 'narrow'
					},
					{
						sizes: '1080x2280',
						src: '/mobile/image-3.jpg',
						form_factor: 'narrow'
					},
					{
						sizes: '1080x2280',
						src: '/mobile/image-4.jpg',
						form_factor: 'narrow'
					}
				]
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
