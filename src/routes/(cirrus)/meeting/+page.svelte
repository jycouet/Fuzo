<script lang="ts">
	let id = (Math.random() + 1).toString(36).substring(7);
</script>

<div class="hero fullscreen bg-blue-800">
	<div class="hero-body">
		<div class="mx-auto">
			<h1 class="title uppercase text-light">Fuzo &mdash; Meeting</h1>
			<a href="/meeting/{id}" class="btn btn-success">Create a new meeting planifcation</a>
		</div>
	</div>
</div>
