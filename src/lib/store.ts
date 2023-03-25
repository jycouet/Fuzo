import { expirable } from '@macfja/svelte-expirable';

export const sessions: Record<
	string,
	Array<{ clientId: string; timezone: number; controller: ReadableStreamDefaultController }>
> = {};

export const notifications = expirable();
