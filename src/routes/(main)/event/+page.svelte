<script lang="ts">
	import Hashids from 'hashids';

	const hashids = new Hashids();

	let year = 2023;
	let month = 4 - 1;
	let day = 25;
	let hours = 18;
	let minutes = 59;
	let title = '';

	$: date = Date.UTC(year, month, day, hours, minutes, 0, 0);
</script>

<article>
	<section>
		<label>
			<span>Year</span>
			<input bind:value={year} type="range" min="1970" max={new Date().getFullYear() + 10} />
			<span>{year}</span>
		</label>

		<label>
			<span>Month</span>
			<input bind:value={month} type="range" min="0" max={11} />
			<span>{month + 1}</span>
		</label>

		<label>
			<span>Day</span>
			<input bind:value={day} type="range" min="0" max={31} />
			<span>{day}</span>
		</label>

		<label>
			<span>Hours</span>
			<input bind:value={hours} type="range" min="0" max={23} />
			<span>{hours}</span>
		</label>

		<label>
			<span>Minutes</span>
			<input bind:value={minutes} type="range" min="0" max={59} />
			<span>{minutes}</span>
		</label>

		<label>
			<span>Title</span>
			<input bind:value={title} />
			<span>&nbsp;</span>
		</label>
	</section>
</article>
<var>{new Date(date)}</var>
<var>{hashids.encode(year, month, day, hours, minutes)}</var>

<hr />
<a href="/event/{hashids.encode(year, month, day, hours, minutes)}?title={btoa(title)}">
	See event
</a>

<style>
	article {
		width: min-content;
	}
	section {
		display: grid;
		width: auto;
		margin: auto 0;
		grid-template-columns: 0fr 1fr 0fr;
	}

	label {
		display: contents;
	}
	input[type='range'] {
		width: 300px;
	}
</style>
