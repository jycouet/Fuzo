import type {  RequestHandler } from './$types';
import { sessions } from '$lib/store';

export type Client = {
    clientId: string,
    timezone: number,
    controller: ReadableStreamDefaultController
}

function getTimezone() {
    return Math.round(Math.random() * 26 - 13);
}

function addClient(slug: string, clientId: string, timezone: number, controller: ReadableStreamDefaultController) {
    sessions.update(s => {
        s[slug] = [
            ...(s[slug] || []),
            {
                clientId,
                timezone,
                controller
            }
        ]
        return s;
    });
}

function removeClient(slug: string, clientId: string) {
    console.log("cancel ", slug, clientId);
    sessions.update(s => {
        s[slug] = s[slug].filter(c => c.clientId !== clientId);
        return s;
    });
}

function notifyClients(slug: string) {
    const unsubscribe = sessions.subscribe(s => {
        if (s[slug]) {
            const clients = s[slug]
            clients.forEach(client => {
                client.controller.enqueue(`data: ${JSON.stringify(clients.map(({clientId, timezone}) => ({clientId, timezone})))}\n\n`);
            });
        }
    });

    unsubscribe();
}

export const GET = (({ params }) => {
    const clientId = crypto.randomUUID();
    const { slug } = params;

    // fake timezone
    const timezone = getTimezone()

    console.log(slug, clientId, timezone);

    const stream = new ReadableStream({
        start(controller: ReadableStreamDefaultController) {
            addClient(slug, clientId, timezone, controller);
            notifyClients(slug);
        },
        cancel() {
            removeClient(slug, clientId)
            notifyClients(slug);
        }
    })

    const options = {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
    };

  return new Response(stream, options)
}) satisfies RequestHandler;