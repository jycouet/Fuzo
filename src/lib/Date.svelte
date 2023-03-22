<script lang="ts">
	import { format as formatter } from 'date-fns';
	import { zonedTimeToUtc } from 'date-fns-tz';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';

	const currentDate: Writable<Date> = getContext('currentDate') ?? writable(new Date());
	const manualDate: Writable<boolean> = getContext('manualDate') ?? writable(false);
	export let date: Date;
	export let format: string;
	export let timezone: string;
	export let utc = false;
	let className = '';

	export { className as class };
</script>

<span
	class={className}
	on:mouseenter={() => {
		$currentDate = zonedTimeToUtc(date, timezone);
		$manualDate = true;
	}}
	on:mouseleave={() => ($manualDate = false)}
>
	{#if utc && timezone}
		{formatter(zonedTimeToUtc(date, timezone), format)}
	{:else}
		{formatter(date, format)}
	{/if}
</span>

<style>
	span {
		cursor: help;
	}
</style>
