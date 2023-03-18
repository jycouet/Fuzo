import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';
import { onMount } from 'svelte';
export const eventSourceStore = <T>(initial: T, uri: string): Readable<T> => {
	return readable(initial, (set) => {
		let eventSource: EventSource | null = null;
		onMount(() => {
			eventSource = new EventSource(uri);

			eventSource.onmessage = function (event) {
				set(JSON.parse(event.data) as T);
			};
			eventSource.onerror = function (...e) {
				console.error(e);
			};
			return () => {
				(eventSource as EventSource).close();
			};
		});
		return () => {
			if (eventSource !== null) {
				eventSource.close();
			}
		};
	});
};
