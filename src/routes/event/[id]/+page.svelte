<script lang="ts">
	import Hashids from 'hashids';
	import { page } from '$app/stores';
	import { formatDistance, format, formatDuration, intervalToDuration } from 'date-fns';
	import { onMount } from 'svelte';

	const hashids = new Hashids();
	let now = Date.now();
	const [year, month, day, hours, minutes] = hashids.decode($page.params.id);
	const timestamp = Date.UTC(
		year as number,
		month as number,
		day as number,
		hours as number,
		minutes as number,
		0,
		0
	);
	$: interval = { start: now, end: timestamp };

	onMount(() => {
		let timer = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(timer);
	});
</script>

<h1>{atob($page.url.searchParams.get('title') ?? '')}</h1>
<span>{format(timestamp, 'PPPPpppp')}</span> &mdash;
<var>{formatDistance(timestamp, now, { addSuffix: true })}</var>
<hr />
<section class="countdown">{formatDuration(intervalToDuration(interval))}</section>
