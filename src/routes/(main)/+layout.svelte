<script>
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css" />
</svelte:head>

<h1><a href="/">Welcome Fuzo</a></h1>
<div class="flex">
	<div class="column">
		<h2>Tools</h2>
		<ul>
			<li>
				<a href="/map">Map</a>
			</li>
			<li>
				<a href="/meeting">Meeting</a>
			</li>
		</ul>
	</div>
	<div class="column">
		<h2>Rooms</h2>
		<ul>
			<li>
				<a href="/room_1">Room 1</a>
			</li>
			<li>
				<a href="/room_2">Room 2</a>
			</li>
		</ul>
	</div>
</div>

<hr />

<slot />

<style>
	.flex {
		display: flex;
		margin-top: 0.5rem;
	}

	.column {
		padding: 0 1rem 1rem 1rem;
		margin: 0.5rem;
		width: 50%;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
	}
</style>
