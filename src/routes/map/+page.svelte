<script lang="ts">
	import DayLightMap from '$lib/DayLightMap.svelte';
	import { utcDate } from '$lib/time';

	let width = 1024;
	let height = 800;

	$: console.log({ height, width });
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<DayLightMap date={utcDate()} height={height - 40} {width} />

<style>
	:global(html) {
		padding: 0;
		margin: 0;
	}
	:global(body) {
		padding: 0;
		margin: 0;
	}
</style>
