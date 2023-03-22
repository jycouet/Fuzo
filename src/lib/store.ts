export const sessions: Record<
	string,
	Array<{ clientId: string; timezone: number; controller: ReadableStreamDefaultController }>
> = {};
