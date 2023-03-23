import { onMount } from 'svelte';
import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';

export interface EventSourceStore<T> extends Readable<T> {
	addEventListener(name: string, runner: (event: MessageEvent) => void): void;
}

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
): EventSourceStore<T> => {
	let eventSource: EventSource | null = null;
	let listeners: Record<string, (event: MessageEvent) => void> = {};
	return {
		...readable(initial, (set) => {
			onMount(() => {
				eventSource = new EventSource(uri);
				Object.entries(listeners).forEach(([name, runner]) => {
					eventSource?.addEventListener(name, runner);
				});
				listeners = {};

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
		}),
		addEventListener: (eventName: string, runner: (event: MessageEvent) => void) => {
			if (eventSource) {
				eventSource.addEventListener(eventName, runner);
			} else {
				listeners[eventName] = runner;
			}
		}
	};
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
