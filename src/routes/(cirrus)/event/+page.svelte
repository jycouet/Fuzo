<script lang="ts">
	import { format } from 'date-fns';
	import Hashids from 'hashids';
	import { onMount } from 'svelte';

	const hashids = new Hashids();

	let year = 2023;
	let month = 6 - 1;
	let day = 10;
	let hours = 18;
	let minutes = 0;
	let title = "Let's play together!";
	let image = 96;

	$: date = Date.UTC(year, month, day, hours, minutes, 0, 0);

	onMount(() => {
		document
			.querySelector(`input[value="${image}"]`)
			?.parentElement?.scrollIntoView({ behavior: 'smooth' });
	});
</script>

<main class="u-items-center u-flex">
	<article class="card mx-auto px-3 max-w-md">
		<header class="card__title headline-3">Create a new Event</header>
		<section class="tile">
			<div class="tile__container">
				<header class="tile__title">Date</header>
				<div class="u-flex">
					<label class="p-1 m-1 bg-gray-200 u-flex u-items-center u-round-sm px-2">
						<strong class="lead mr-2">Year</strong>
						<input bind:value={year} type="range" min="1970" max={new Date().getFullYear() + 10} />
						<span class="tag ml-2">{year}</span>
					</label>

					<label class="p-1 m-1 bg-gray-200 u-flex u-items-center u-round-sm px-2">
						<strong class="lead mr-2">Month</strong>
						<input bind:value={month} type="range" min="0" max={11} />
						<span class="tag ml-2">{month + 1}</span>
					</label>

					<label class="p-1 m-1 bg-gray-200 u-flex u-items-center u-round-sm px-2">
						<strong class="lead mr-2">Day</strong>
						<input bind:value={day} type="range" min="0" max={31} />
						<span class="tag ml-2">{day}</span>
					</label>
				</div>
			</div>
		</section>

		<section class="tile">
			<div class="tile__container">
				<header class="tile__title">Time</header>

				<div class="u-flex">
					<label class="p-1 m-1 bg-gray-200 u-flex u-items-center u-round-sm px-2">
						<strong class="lead mr-2">Hours</strong>
						<input bind:value={hours} type="range" min="0" max={23} />
						<span class="tag ml-2">{hours}</span>
					</label>

					<label class="p-1 m-1 bg-gray-200 u-flex u-items-center u-round-sm px-2">
						<strong class="lead mr-2">Minutes</strong>
						<input bind:value={minutes} type="range" min="0" max={59} />
						<span class="tag ml-2">{minutes}</span>
					</label>
				</div>
			</div>
		</section>
		<section class="card__footer u-text-center">{format(date, 'PPPPpppp')}</section>
		<section class="tile">
			<div class="tile__content w-100p">
				<label for="title" class="tile__title">Title</label>
				<input id="title" class="w-100p" bind:value={title} />
			</div>
		</section>
		<section class="tile">
			<div class="tile__content">
				<header class="tile__title">Image</header>
				<div class="u-overflow-y-scroll h-32">
					{#each { length: 1084 } as _, index}
						<label
							class="u-inline-flex u-round-md p-1"
							class:bg-info={index == image}
							class:u-shadow-inset-md={index == image}
						>
							<input name="image" class="mr-1" type="radio" bind:group={image} value={index} />
							<img
								src="https://picsum.photos/id/{index}/100/100.jpg"
								height="100"
								width="100"
								alt="Event image with id {index}"
								class="u-round-sm u-shadow-md"
							/>
						</label>
					{/each}
				</div>
			</div>
		</section>
		<section class="card__action-bar u-center">
			<a
				class="btn btn-link"
				href="/event/{hashids.encode(year, month, day, hours, minutes)}?img={image}&title={btoa(
					encodeURIComponent(title)
				)}"
			>
				See event
			</a>
		</section>
	</article>
	<div class="h-screen" />
</main>

<style>
	input[type='range'] {
		padding: 0 !important;
	}
</style>
