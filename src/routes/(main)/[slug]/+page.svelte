<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	let messages: any = [];

	let eventSource: EventSource | null = null;

	// reactivity for $page.params.slug
	$: {
		if (browser) {
			closeEventSource();

			eventSource = new EventSource(`/${$page.params.slug}/s`);
			eventSource.onmessage = (event) => {
				messages = JSON.parse(event.data);
			};
			eventSource.onerror = function (...e) {
				console.error(e);
			};
		}
	}

	beforeNavigate((info) => {
		closeEventSource();
	});

	function closeEventSource() {
		if (eventSource !== null) {
			eventSource.close();
			eventSource = null;
		}
	}
</script>

<h3>{$page.params.slug}</h3>

<pre>{JSON.stringify(messages, null, 2)}</pre>
