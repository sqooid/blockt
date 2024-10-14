<script lang="ts">
	import type { LocalStore } from '$lib/components/config.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getContext } from 'svelte';

	const visited = getContext('visited') as LocalStore<boolean>;
	visited.value = true;
</script>

<div class="typography mx-auto mb-64 gap-8 p-4">
	<div class="mx-auto max-w-prose">
		<h2>Why bother time blocking?</h2>
		<p>
			The time blocking technique, as described in The One Thing by Gary Keller, is a powerful
			productivity strategy. It involves scheduling specific blocks of time dedicated to your most
			important task—your "One Thing"—to help achieve extraordinary results. Here are a few reasons
			why you'd want to use this technique:
		</p>

		<p></p>
		<ol>
			<li>
				Focused Work: Time blocking allows you to focus entirely on the most important task without
				distractions. By dedicating a specific time, you're better able to concentrate and make
				meaningful progress.
			</li>
			<li>
				Prioritization: The concept of "The One Thing" is about focusing on the task that will make
				everything else easier or unnecessary. Time blocking helps ensure that your most critical
				work gets done rather than getting lost in day-to-day busywork.
			</li>

			<li>
				Improved Productivity: By intentionally scheduling your day around your top priorities,
				you're less likely to waste time on less important activities, leading to more efficient use
				of time and higher productivity.
			</li>
			<li>
				Consistency: Time blocking creates a routine, which builds momentum. Working on your "One
				Thing" at the same time every day ensures you consistently make progress toward your goals.
			</li>
			<li>
				Work-Life Balance: Keller emphasizes blocking time for personal commitments as well. This
				helps create a better balance between work and personal life by making sure both are
				accounted for in your schedule.
			</li>
		</ol>
		<div class="mx-auto mb-8 w-fit">
			<Button variant="outline" href="/">Start blocking!</Button>
		</div>
		<h2>How to use Blockt</h2>
	</div>
	<div class="grid max-w-screen-lg items-center gap-4 sm:grid-cols-[fit-content(60%)_1fr]">
		<img src="/tutorial/image-1.png" alt="tutorial 1" />
		<p>Click on an empty block in the timeline to create a new block</p>
		<img src="/tutorial/image-2.png" alt="tutorial 2" />
		<p>Give the new block a name and colour and click Add to create the block</p>
		<img src="/tutorial/image-3.png" alt="tutorial 3" />
		<p>Resize blocks by dragging on their top or bottom borders</p>
		<img src="/tutorial/image-4.png" alt="tutorial 4" />
		<p>Move blocks around by dragging and dropping</p>
		<img src="/tutorial/image-5.png" alt="tutorial 5" />
		<p>Change block text and colours or delete blocks by clicking on them</p>
		<img src="/tutorial/image-6.png" alt="tutorial 6" />
		<p>Change settings and clear blocks for a new day by clicking the cog icon</p>
	</div>
</div>

<style lang="postcss">
</style>
