import { User } from '$lib/User';
import type { RequestHandler } from './$types';

export type Client = {
	user?: User;
	uuid: string;
	controller: ReadableStreamDefaultController;
};

const sessions: Record<string, Array<Client>> = {};

function addClient(meetingId: string, uuid: string, controller: ReadableStreamDefaultController) {
	log(meetingId, uuid, 'enter');
	if (!Object.keys(sessions).includes(meetingId)) {
		sessions[meetingId] = [];
	}
	sessions[meetingId].push({
		uuid,
		controller
	});
}

function removeClient(meetingId: string, uuid: string) {
	log(meetingId, uuid, 'leave');
	if (Object.keys(sessions).includes(meetingId)) {
		sessions[meetingId] = sessions[meetingId].filter((value) => value.uuid !== uuid);
	}
}

function notifyClients(meetingId: string) {
	if (Object.keys(sessions).includes(meetingId)) {
		const clients = sessions[meetingId];
		clients.forEach((client) => {
			client.controller.enqueue(
				`data: ${JSON.stringify(
					clients.map(({ user }) => user).filter((u) => u !== undefined)
				)}\n\n`
			);
		});
	}
}

function updateClient(meetingId: string, uuid: string, user: User) {
	log(meetingId, uuid, 'update');
	if (Object.keys(sessions).includes(meetingId)) {
		const userInfo = sessions[meetingId].find(({ uuid: info }) => info === uuid);
		if (userInfo) {
			userInfo.user = user;
		}
	}
}

export const GET = (({ params }) => {
	const { id } = params;
	const uuid = crypto.randomUUID();

	const stream = new ReadableStream({
		start(controller: ReadableStreamDefaultController) {
			addClient(id, uuid, controller);
			controller.enqueue(`event: register\ndata: ${uuid}\n\n`);
			notifyClients(id);
		},
		cancel() {
			removeClient(id, uuid);
			notifyClients(id);
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

export const POST = (async ({ params, request }) => {
	const { id } = params;
	const body: { user: User; uuid: string } = JSON.parse(await request.text(), User.reviver);
	if (body.uuid === null) {
		return new Response('KO');
	}
	updateClient(id, body.uuid, body.user);
	notifyClients(id);
	return new Response('OK');
}) satisfies RequestHandler;

function log(meetingId: string, who: string, action: 'enter' | 'leave' | 'update'): void {
	console.info(`[Room ${meetingId}] ${who}: ${action}`);
}
