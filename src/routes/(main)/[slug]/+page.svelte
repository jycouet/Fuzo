<script>
	import { page } from '$app/stores';
	import { eventSourceStore } from '$lib/EventSourceStore';

	let h = eventSourceStore([], `/${$page.params.slug}/s`);
</script>

<h3>{$page.params.slug}</h3>
<pre>{JSON.stringify($h, null, 2)}</pre>
