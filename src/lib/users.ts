import { writable } from 'svelte/store';
import { User } from './User';
import { persistBrowserLocal, addSerializableClass } from '@macfja/svelte-persistent-store';

addSerializableClass(User);
export const me = persistBrowserLocal(writable<User>(new User('', '')), 'me');
