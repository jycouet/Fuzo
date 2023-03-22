import { onMount } from 'svelte';
import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';

/**
 * Create a store that will update with a EventSource.
 * @param initial - The initial value of the store before receiving the first message from the SourceEvent
 * @param uri - The URI of the EventSource to listener to
 * @param transformer - The transformation function to convert the raw string in an usable data (default: `JSON.parse` function)
 */
export const eventSourceStore = <T>(
	initial: T,
	uri: string,
	transformer: (input: string) => T = JSON.parse
): Readable<T> => {
	return readable(initial, (set) => {
		let eventSource: EventSource | null = null;
		onMount(() => {
			eventSource = new EventSource(uri);

			eventSource.onmessage = function (event) {
				set(transformer(event.data));
			};
			eventSource.onerror = function (...e) {
				console.error(e);
			};
			return () => {
				// The component that create the store is unmounted,
				// we close the connection
				closeEventSource(eventSource);
			};
		});
		return () => {
			// If there is no listener to the store,
			// we close the connection
			closeEventSource(eventSource);
		};
	});
};

/**
 * Close, if possible and necessary, an EventSource
 * @param eventSource - The EventSource to close
 */
function closeEventSource(eventSource: EventSource | null): void {
	if (eventSource !== null && eventSource.readyState !== 2) {
		eventSource.close();
	}
}
