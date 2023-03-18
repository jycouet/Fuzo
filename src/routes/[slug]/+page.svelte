<script>
	import { page } from '$app/stores';
	import { eventSourceStore } from '$lib/EventSourceStore';

	let h = eventSourceStore([], `/${$page.params.slug}/s`);
</script>

<p>{$page.params.slug}</p>
<pre>{JSON.stringify($h, null, 2)}</pre>
