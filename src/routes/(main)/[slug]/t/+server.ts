import { sessions } from '$lib/store';
import type { RequestHandler } from './$types';

export const GET = (() => {
	let session: any;

	sessions.subscribe((s) => {
		session = s;
	});

	for (let i = 0; i < 100; i++) console.log();

	console.log(session);
	console.log();

	return new Response(JSON.stringify(session));
}) satisfies RequestHandler;
