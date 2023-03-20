<script lang="ts">
	import DayLightMap from '$lib/DayLightMap.svelte';
	import { PROJECTION_MAP } from '$lib/map.js';
	import all from '$lib/timezone.json';

	const delta = Array.from(new Set(Object.values(all)));
	let width = 1024;
	let height = 800;
	let projectionType = 'mercator';
	let angle = 0;
	let timezones: Array<string> = [];
	let enabletz = false;
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<DayLightMap
	date={new Date()}
	height={height - 80}
	{width}
	{projectionType}
	{angle}
	{timezones}
	{enabletz}
/>

<select bind:value={projectionType}
	>{#each Object.keys(PROJECTION_MAP) as value}<option>{value}</option>{/each}</select
>
<input type="range" min="0" max="360" step="1" bind:value={angle} />
<input type="checkbox" bind:checked={enabletz} />
<select bind:value={timezones} multiple>
	{#each delta as i}<option>{i}</option>{/each}
</select>

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
