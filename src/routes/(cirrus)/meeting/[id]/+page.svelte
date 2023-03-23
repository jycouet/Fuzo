<script lang="ts">
	import { page } from '$app/stores';
	import DayLightMap from '$lib/DayLightMap.svelte';
	import { eventSourceStore } from '$lib/EventSourceStore';
	import { User, matchingSlots } from '$lib/User';
	import type { UTCSlot } from '$lib/User';
	import _timezones from '$lib/timezone.json';
	import { me } from '$lib/users';
	import { intlFormat } from 'date-fns';
	import { onMount, setContext } from 'svelte';
	import { derived, writable, type Readable } from 'svelte/store';
	import EditUser from './EditUser.svelte';
	import ShowMatch from './ShowMatch.svelte';
	import ShowUser from './ShowUser.svelte';

	// Typings
	const timezones = _timezones as Record<string, string>;

	let height = 1024,
		width = 800,
		selectedTz: Array<string> = [],
		angle: 0,
		matches: Array<UTCSlot> = [];
	let currentDate = writable(new Date());
	let manualDate = writable(false);
	let uuid: string | null = null;
	const notifyUrl = `/meeting/${$page.params.id}/notify`;
	const users = eventSourceStore<Array<User>>([], notifyUrl, (input) =>
		JSON.parse(input, User.reviver)
	);
	users.addEventListener('register', (event) => {
		uuid = event.data;
		$me = $me;
	});
	const others: Readable<Array<User>> = derived([users], ([$users]) =>
		$users.filter((user) => user.name !== $me.name)
	);

	setContext('currentDate', currentDate);
	setContext('manualDate', manualDate);

	onMount(() => {
		me.subscribe((user) =>
			fetch(notifyUrl, { method: 'POST', body: JSON.stringify({ uuid, user }) })
		);
		const interval = setInterval(() => {
			if (!$manualDate) {
				$currentDate = new Date();
			}
		}, 10_000);
		return () => clearInterval(interval);
	});

	$: matches = matchingSlots($me as User, ...$others);
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div class="u-top-0 u-bottom-0 u-left-0 u-right-0 u-fixed u-z-n1">
	<DayLightMap {width} {height} enabletz timezones={selectedTz} date={$currentDate} {angle} />
</div>

<main class="hero fullscreen">
	<article class="hero-body">
		<section class="content">
			<header class="u-text-center m-4">
				<h1 class="headline-1 u-inline-block p-2 u-shadow-lg bg-white u-round-lg font-alt">
					Fuzo &mdash; Meeting
				</h1>
			</header>
			<a class="btn" href="#edit-user">Edit your Profile</a>
			<div class="list-dropdown">
				<button class="btn-dark btn-dropdown m-0" disabled={$others.length === 0}>
					Users &nbsp;<span class="tag tag--white">{$others.length}</span>
					<span class="caret" />
				</button>
				<ul class="menu">
					{#each $others as user}
						<li class="menu-item">
							<a
								href="#user/{user.name}"
								on:click={() => (selectedTz = [user.timezone, timezones[user.timezone] ?? ''])}
								>{user.name}</a
							>
						</li>
					{/each}
				</ul>
			</div>
			<a
				class="btn"
				class:btn--disabled={matches.length === 0}
				class:btn-success={matches.length > 0}
				href="{matches.length === 0 ? '!' : ''}#matching"
				>Matching slots &nbsp;
				<div class="tag tag--dark">{matches.length}</div></a
			>
		</section>
	</article>

	<EditUser />
	{#each $others as user}
		<ShowUser {user} id={user.name} on:close={() => (selectedTz = [])} />
	{/each}
	<ShowMatch slots={matches} others={$others} />
</main>

<div class="p-4 u-top-0 u-justify-center u-right-0 u-left-0 u-absolute u-flex">
	<div class="toast toast--translucent u-basis-content currentDate">
		{intlFormat($currentDate.getTime(), {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: 'short',
			timeZone: $me.timezone || 'Etc/UTC'
		})}
	</div>
</div>

<style>
	header h1 {
		opacity: 60%;
		transition: opacity 200ms linear;
		user-select: none;
	}
	header h1:hover {
		opacity: 25%;
	}

	.currentDate {
		z-index: 9999;
	}
</style>
