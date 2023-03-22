import { sessions } from '$lib/store';
import type { RequestHandler } from './$types';

export type Client = {
	clientId: string;
	timezone: number;
	controller: ReadableStreamDefaultController;
};

function getTimezone() {
	return Math.round(Math.random() * 26 - 13);
}

function addClient(
	slug: string,
	clientId: string,
	timezone: number,
	controller: ReadableStreamDefaultController
) {
	if (!Object.keys(sessions).includes(slug)) {
		sessions[slug] = [];
	}
	sessions[slug].push({
		clientId,
		timezone,
		controller
	});
}

function removeClient(slug: string, clientId: string) {
	console.log('leave', slug, clientId);
	if (Object.keys(sessions).includes(slug)) {
		sessions[slug] = sessions[slug].filter((value) => value.clientId !== clientId);
	}
}

function notifyClients(slug: string) {
	if (Object.keys(sessions).includes(slug)) {
		const clients = sessions[slug];
		clients.forEach((client) => {
			client.controller.enqueue(
				`data: ${JSON.stringify(
					clients.map(({ clientId, timezone }) => ({ clientId, timezone }))
				)}\n\n`
			);
		});
	}
}

export const GET = (({ params }) => {
	const clientId = crypto.randomUUID();
	const { slug } = params;

	// fake timezone
	const timezone = getTimezone();

	console.log('enter', slug, clientId, timezone);

	const stream = new ReadableStream({
		start(controller: ReadableStreamDefaultController) {
			addClient(slug, clientId, timezone, controller);
			notifyClients(slug);
		},
		cancel() {
			removeClient(slug, clientId);
			notifyClients(slug);
		}
	});

	const options = {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	};

	return new Response(stream, options);
}) satisfies RequestHandler;
