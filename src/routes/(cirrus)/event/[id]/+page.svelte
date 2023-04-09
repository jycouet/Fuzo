<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { format, intervalToDuration, isBefore } from 'date-fns';
	import Hashids from 'hashids';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

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
	$: duration = intervalToDuration(interval);

	onMount(() => {
		let timer = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(timer);
	});
</script>

<svelte:head>
	<meta
		property="og:image"
		content="https://picsum.photos/id/{$page.url.searchParams.get('img') ?? 19}/400/400"
	/>
	<title
		>{decodeURIComponent(atob($page.url.searchParams.get('title') ?? ''))} - {format(
			timestamp,
			'PPPPpppp'
		)}</title
	>
</svelte:head>

<main class="hero fullscreen u-relative">
	<img
		src="https://picsum.photos/id/{$page.url.searchParams.get('img') ?? 19}/400/400"
		alt="event theme"
		class="u-fixed u-overlay h-100p u-z-n1 w-100p u-blur-sm img-cover"
	/>
	<article class="hero-body u-flex-column">
		<header class="mx-auto u-text-center">
			<h1 class="headline-1 hover-grow title">
				{decodeURIComponent(atob($page.url.searchParams.get('title') ?? ''))}
			</h1>
			<span class="subtitle font-semibold frame bg-white u-rounded-xs px-2 py-1 u-inline-block"
				>{format(timestamp, 'PPPPpppp')}</span
			>
		</header>
		{#if browser}
			<div class="divider" />
			<section class="frame u-round-lg bg-white u-shadow-lg">
				<dl class="grid text-xl frame__body" class:past={isBefore(timestamp, now)}>
					{#if duration.years ?? 0 > 0}
						<dt>
							{#key duration.years}<span in:fly={{ y: 20 }} out:fly={{ y: -20 }}
									>{duration.years}</span
								>{/key}
						</dt>
						<dd>year{duration.years === 1 ? '' : 's'}</dd>
					{/if}
					{#if duration.months ?? 0 > 0}
						<dt>
							{#key duration.months}<span in:fly={{ y: 20 }} out:fly={{ y: -20 }}
									>{duration.months}</span
								>{/key}
						</dt>
						<dd>month{duration.months === 1 ? '' : 's'}</dd>
					{/if}
					{#if duration.days ?? 0 > 0}
						<dt>
							{#key duration.days}<span in:fly={{ y: 20 }} out:fly={{ y: -20 }}
									>{duration.days}</span
								>{/key}
						</dt>
						<dd>day{duration.days === 1 ? '' : 's'}</dd>
					{/if}
					<dt>
						{#key duration.hours}<span in:fly={{ y: 20 }} out:fly={{ y: -20 }}
								>{duration.hours}</span
							>{/key}
					</dt>
					<dd>hour{duration.hours === 1 ? '' : 's'}</dd>
					<dt>
						{#key duration.minutes}<span in:fly={{ y: 20 }} out:fly={{ y: -20 }}
								>{duration.minutes}</span
							>{/key}
					</dt>
					<dd>minute<span class:dimmed={duration.minutes === 1}>s</span></dd>
					<dt>
						{#key duration.seconds}<span in:fly={{ y: 20 }} out:fly={{ y: -20 }}
								>{duration.seconds}</span
							>{/key}
					</dt>
					<dd>second<span class:dimmed={duration.seconds === 1}>s</span></dd>
				</dl>
			</section>
		{/if}
	</article>
</main>

<style>
	dl {
		padding-inline: 1em;
		margin: 0.5em;
		grid-template-columns: repeat(12, 0fr);
		grid-template-rows: 0fr;
	}

	@media (max-width: 1024px) {
		dl {
			grid-template-columns: repeat(4, 0fr);
			grid-template-rows: unset;
		}
	}

	@media (max-width: 450px) {
		dl {
			grid-template-columns: repeat(2, 0fr);
		}
	}

	.title {
		color: white;
		text-shadow: 0 1px 0 #c0c0c0, 0 2px 0 #c6c6c6, 0 3px 0 #cccccc, 0 4px 0 #d2d2d2, 0 5px 0 #d8d8d8,
			0 7px 4px rgba(0, 0, 0, 0.5);
	}

	dl dt {
		position: relative;
		height: 3em;
		width: 2ch;
		text-align: right;
		margin-left: 1ch;
		line-height: 1em;
		font-family: monospace;
	}

	dl dt:first-of-type {
		margin-left: 0;
	}

	dl dt + dd {
		margin-left: 1ch;
		height: 3em;
		line-height: 3em;
		padding: 0;
		margin-block: 0;
	}

	dl dt span {
		display: inline-block;
		position: absolute;
		right: 0;
		top: 1em;
		bottom: 1em;
		width: 2ch;
		min-width: 2ch;
	}

	dl dt + dd span {
		opacity: 1;
		transition: opacity 400ms;
	}

	dl dt + dd span.dimmed {
		opacity: 0.3;
	}

	.past {
		position: relative;
	}
	.past:before {
		position: absolute;
		content: 'Past event';
		top: 0;
		left: 0;
		color: gray;
		font-size: 0.75em;
		line-height: 1em;
	}
</style>
