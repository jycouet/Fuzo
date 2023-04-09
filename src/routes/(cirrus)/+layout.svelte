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
</style>
