<main class="hero">
	<section class="content">
		<header class="u-text-center"><h1 class="headline-2">Fuzo</h1></header>
		<h2 class="headline-4">What is Fuzo?</h2>
		<p class="lead">Fuzo a is tool to help creating a multi-timezone meeting</p>
		<p>
			The <strong>Fuzo</strong> application don't store any data on the server. The server don't
			even have a database!<br />
			Some data are keept in your browser, so the next time you goes to the website your information
			are already here (like your nickname, your timezone, <em>etc.</em>).<br />
			During the meeting planning, if you leave the planning room, all your informations shared with
			members of the room is also removed.
		</p>

		<article class="card p-4">
			<section class="tile">
				<div class="tile__container">
					<header class="tile__title">Create a meeting</header>
					<p class="tile__subtitle">
						Find the best time to have a meeting with every one.<br />
						Share the meeting URL with everyone, each of them can fill there avaibilities, and the perfect
						slot for everyone will be there!
					</p>
				</div>
				<footer class="tile__buttons">
					<a href="/meeting" class="btn btn-link">Create a meeting</a>
				</footer>
			</section>
			<div class="divider" />
			<section class="tile">
				<div class="tile__container">
					<header class="tile__title">Create a event</header>
					<p class="tile__subtitle">
						Tell everone about your event.<br />
						Share the event URL with everyone, each of them will see when the event will be and how much
						time until it start.
					</p>
				</div>
				<footer class="tile__buttons">
					<a href="/event" class="btn btn-link">Create an event</a>
				</footer>
			</section>
		</article>

		<article class="frame bg-white u-bg-opacity-30">
			<header class="fame__header p-2">
				The <strong>Fuzo</strong> application have been created during the
				<a href="https://hack.sveltesociety.dev/">Svelte Hackathon 2023</a>.
			</header>
			<div class="frame__body">
				Here a short list of what have been used to built-it:
				<dl class="px-2">
					<dt><a href="https://kit.svelte.dev/">SvelteKit</a></dt>
					<dd>As the (meta) Framework</dd>
					<dt><abbr title="Server Side Event">SSE</abbr></dt>
					<dd>To synchronize every user in the same meeting plannification room</dd>
					<dt><a href="https://d3js.org/">D3.js</a></dt>
					<dd>For the graphics rendering</dd>
					<dt><a href="https://cirrus-ui.netlify.app/">Cirrus</a></dt>
					<dd>For the user interface design</dd>
				</dl>
			</div>
			<div class="frame__footer footer mt-1 bg-gray-300 u-bg-opacity-30">
				Created by the member of the French Svelte Society<br />
				Original idea by jycouet, SSE prototyping by Maxime, pieced together by Syberag.
			</div>
		</article>
	</section>
</main>

<style>
	p {
		text-shadow: 0 0 8px var(--cirrus-bg);
	}

	main:before {
		content: '';
		position: fixed;
		background: url('https://spaceplace.nasa.gov/gallery-earth/en/ISS_earth.en.jpg') center center
			no-repeat;
		background-size: auto 100%;
		filter: blur(10px) saturate(1.5);
		opacity: 0.6;
		inset: -20px;
		z-index: -1;
	}
</style>
