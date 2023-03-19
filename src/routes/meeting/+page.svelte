<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import 'cirrus-ui/dist/cirrus-all.min.css';
	import DayLightMap from '$lib/DayLightMap.svelte';
	import EditUser from './EditUser.svelte';
	import ShowUser from './ShowUser.svelte';
	import ShowMatch from './ShowMatch.svelte';
	import { utcDate } from '$lib/time';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { me } from '$lib/users';
	import { User, matchingSlots } from '$lib/User';
	import type { UTCSlot } from '$lib/User';
	import { intlFormat } from 'date-fns';
	import _timezones from '$lib/timezone.json';
	import { utcToZonedTime } from 'date-fns-tz';

	// Typings
	const timezones = _timezones as Record<string, string>;

	let height = 1024,
		width = 800,
		selectedTz: Array<string> = [],
		angle: 0,
		matches: Array<UTCSlot> = [];
	let currentDate = writable(utcDate());
	let manualDate = writable(false);
	let others: Writable<Array<User>> = writable([]);

	setContext('currentDate', currentDate);
	setContext('manualDate', manualDate);

	onMount(() => {
		const interval = setInterval(() => {
			if (!$manualDate) {
				$currentDate = utcDate();
			}
		}, 10_000);
		return () => clearInterval(interval);
	});

	$: matches = matchingSlots($me as User, ...$others);

	function test() {
		const john = new User('John', 'Europe/Berlin');
		john.addTodaySlot(9, 10);
		john.addTodaySlot(11, 12);
		john.addTodaySlot(14, 17);
		const doe = new User('Doe', 'Asia/Tokyo');
		doe.addTodaySlot(9, 11);
		doe.addTodaySlot(16, 18);

		$others = [john, doe];
	}
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
			<button class="outline btn-danger" on:click={test}>Add fake Users</button>
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
		{intlFormat(utcToZonedTime($currentDate, $me.timezone), {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: 'short'
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
