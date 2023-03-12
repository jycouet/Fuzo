import { addMinutes } from 'date-fns';

export function utcDate() {
	const now = new Date();
	return addMinutes(now, now.getTimezoneOffset());
}
