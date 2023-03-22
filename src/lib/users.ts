import { persistBrowserLocal, addSerializableClass } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import { User } from './User';

addSerializableClass(User);
export const me = persistBrowserLocal(writable<User>(new User('', '')), 'me');
