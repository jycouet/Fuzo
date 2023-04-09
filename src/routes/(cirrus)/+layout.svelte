<script lang="ts">
	import { notifications } from '$lib/store';
	import 'cirrus-ui/dist/cirrus-all.min.css';
	import { fade } from 'svelte/transition';
</script>

<slot />

<aside>
	{#each $notifications as { data, id, repeated } (id)}
		<div class="toast" data-repeated={repeated > 0 ? repeated + 1 : undefined} transition:fade>
			{data}
		</div>
	{/each}
</aside>

<style>
	:global(html) {
		background: var(--cirrus-bg);
	}

	aside {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		user-select: none;
		pointer-events: none;
	}
	aside div[data-repeated]:after {
		content: '(\00D7'attr(data-repeated) ')';
		margin-left: 1ch;
		font-size: 0.75em;
		opacity: 0.75;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--cirrus-fg: #eee;
			--cirrus-bg: #222222;
		}

		:global(.card) {
			background-color: #111;
		}
		:global(
				input:not([type='checkbox']):not([type='radio']):not([type='submit']):not(
						[type='button']
					):not([type='reset']):not([type='range']),
				select
			) {
			background-color: var(--cirrus-bg);
			color: inherit;
			border-color: #444;
		}
		:global(.tag) {
			background-color: #444;
		}
		:global(.card .card__action-bar) {
			border-top-color: #444;
		}
		:global(.divider) {
			border-top-color: #444;
		}
		:global(.divider[data-content]::after) {
			background-color: #222;
			color: #444;
		}
	}
</style>
