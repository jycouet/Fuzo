import type {  RequestHandler } from './$types';
import { sessions } from '$lib/store';

export const GET = (() => {
    
    let session: any;

    sessions.subscribe(s => {
        session = s;
    });

    for(let i = 0; i < 100; i++)
        console.log()
        
    console.log(session)
    console.log()

  return new Response(JSON.stringify(session))
}) satisfies RequestHandler;