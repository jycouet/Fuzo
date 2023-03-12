import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { parse, areIntervalsOverlapping, isBefore, isAfter } from 'date-fns';

export type UTCSlot = {
	utcStart: Date;
	utcEnd: Date;
};
export type LocalSlot = UTCSlot & {
	localStart: Date;
	localEnd: Date;
};
export class User {
	private _name: string;
	private _slots: Array<LocalSlot> = [];
	private _tz: string;

	set name(value: string) {
		this._name = value;
	}
	get name(): string {
		return this._name;
	}

	get slots(): Array<LocalSlot> {
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
			? zonedTimeToUtc(parse(start.toString(), 'H', new Date()), this._tz)
			: parse(start.toString(), 'H', new Date());
		const utcEnd = isLocal
			? zonedTimeToUtc(parse(end.toString(), 'H', new Date()), this._tz)
			: parse(end.toString(), 'H', new Date());
		this._slots.push({
			utcStart,
			utcEnd,
			localStart: utcToZonedTime(utcStart, this._tz),
			localEnd: utcToZonedTime(utcEnd, this._tz)
		});
	}
	addDateSlot(start: Date, end: Date, isLocal = true) {
		const utcStart = isLocal ? zonedTimeToUtc(start, this._tz) : start;
		const utcEnd = isLocal ? zonedTimeToUtc(end, this._tz) : end;
		this._slots.push({
			utcStart,
			utcEnd,
			localStart: utcToZonedTime(utcStart, this._tz),
			localEnd: utcToZonedTime(utcEnd, this._tz)
		});
	}
	removeAllSlots() {
		this._slots = [];
	}

	toLocal(slot: UTCSlot): LocalSlot {
		return {
			...slot,
			localStart: utcToZonedTime(slot.utcStart, this._tz),
			localEnd: utcToZonedTime(slot.utcEnd, this._tz)
		};
	}

	toString(): string {
		return this.name;
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
	return user1.reduce((matches, { utcStart, utcEnd }) => {
		const interval1 = { start: utcStart, end: utcEnd };
		return [
			...matches,
			...user2.reduce((carry, slot) => {
				const interval2 = { start: slot.utcStart, end: slot.utcEnd };
				if (!areIntervalsOverlapping(interval1, interval2)) {
					return carry;
				}
				carry.push({
					utcStart: isAfter(interval1.start, interval2.start) ? interval1.start : interval2.start,
					utcEnd: isBefore(interval1.end, interval2.end) ? interval1.end : interval2.end
				} as UTCSlot);
				return carry;
			}, [] as Array<UTCSlot>)
		];
	}, [] as Array<UTCSlot>);
}
