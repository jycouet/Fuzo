import { areIntervalsOverlapping, isBefore, isAfter, set, format as formater } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export type UTCSlot = {
	start: number;
	end: number;
};
export type SerializedUser = {
	_u: {
		n: string;
		t: string;
		sl: Array<{
			s: number;
			e: number;
		}>;
	};
};
export class User {
	private _name: string;
	private _slots: Array<UTCSlot> = [];
	private _tz: string;

	set name(value: string) {
		this._name = value;
	}
	get name(): string {
		return this._name;
	}

	get slots(): Array<UTCSlot> {
		return this._slots;
	}
	set timezone(value: string) {
		this._tz = value;
	}
	get timezone(): string {
		return this._tz;
	}

	constructor(name: string, tz: string) {
		this._name = name;
		this._tz = tz;
	}

	addTodaySlot(start: number, end: number, isLocal = true) {
		const utcStart = isLocal
			? zonedTimeToUtc(
					set(new Date(), { hours: start, minutes: 0, seconds: 0, milliseconds: 0 }),
					this._tz
			  )
			: set(new Date(), { hours: start, minutes: 0, seconds: 0, milliseconds: 0 });
		const utcEnd = isLocal
			? zonedTimeToUtc(
					set(new Date(), { hours: end, minutes: 0, seconds: 0, milliseconds: 0 }),
					this._tz
			  )
			: set(new Date(), { hours: end, minutes: 0, seconds: 0, milliseconds: 0 });
		this._slots.push({
			start: utcStart.getTime(),
			end: utcEnd.getTime()
		});
	}
	addDateSlot(start: Date, end: Date, isLocal = true) {
		const utcStart = isLocal ? zonedTimeToUtc(start, this._tz) : start;
		const utcEnd = isLocal ? zonedTimeToUtc(end, this._tz) : end;
		this._slots.push({
			start: utcStart.getTime(),
			end: utcEnd.getTime()
		});
	}
	removeAllSlots() {
		this._slots = [];
	}

	format(slot: UTCSlot, format: string): { start: string; end: string } {
		return {
			start: formater(utcToZonedTime(slot.start, this._tz), format),
			end: formater(utcToZonedTime(slot.end, this._tz), format)
		};
	}

	toString(): string {
		return this.name;
	}
	toJSON(): SerializedUser {
		return {
			_u: {
				n: this._name,
				t: this._tz,
				sl: this._slots.map((slot) => ({ s: slot.start, e: slot.end }))
			}
		};
	}

	static reviver(key: string, value: unknown) {
		if (key === '_u' && ['n', 't', 'sl'].every((k) => Object.keys(value as object).includes(k))) {
			const user = new User((value as SerializedUser['_u']).n, (value as SerializedUser['_u']).t);
			(value as SerializedUser['_u']).sl.forEach((slot) =>
				user.addDateSlot(new Date(slot.s), new Date(slot.e), false)
			);
			return user;
		}
		if (
			typeof value === 'object' &&
			Object.keys(value as object).includes('_u') &&
			((value as { _u: unknown })['_u'] as User) instanceof User
		) {
			return (value as { _u: User })['_u'];
		}
		return value;
	}
}

export function matchingSlots(...users: Array<User | { slots: Array<UTCSlot> }>): Array<UTCSlot> {
	if (users.length < 2) {
		return [];
	}
	return users.slice(1).reduce((carry, user) => {
		return matchingBetween(carry, user.slots);
	}, users[0].slots);
}

function matchingBetween(user1: Array<UTCSlot>, user2: Array<UTCSlot>): Array<UTCSlot> {
	return user1.reduce((matches, interval1) => {
		return [
			...matches,
			...user2.reduce((carry, interval2) => {
				if (!areIntervalsOverlapping(interval1, interval2)) {
					return carry;
				}
				carry.push({
					start: isAfter(interval1.start, interval2.start) ? interval1.start : interval2.start,
					end: isBefore(interval1.end, interval2.end) ? interval1.end : interval2.end
				} as UTCSlot);
				return carry;
			}, [] as Array<UTCSlot>)
		];
	}, [] as Array<UTCSlot>);
}
