import { describe, it, expect } from 'vitest';
import { matchingSlots, User } from './User';
import { parse, setHours, setMilliseconds, setMinutes, setSeconds } from 'date-fns';
import { utcDate } from './time';

describe('User addTodaySlot', () => {
	const expectedLocalizedSlots = [
		{
			utcStart: setMilliseconds(setSeconds(setMinutes(setHours(utcDate(), 22), 0), 0), 0),
			utcEnd: setMilliseconds(setSeconds(setMinutes(setHours(utcDate(), 23), 0), 0), 0),
			localStart: setMilliseconds(setSeconds(setMinutes(setHours(utcDate(), 16), 0), 0), 0),
			localEnd: setMilliseconds(setSeconds(setMinutes(setHours(utcDate(), 17), 0), 0), 0)
		}
	];

	it('Local hours', () => {
		const user = new User('John', 'America/Toronto');
		user.addTodaySlot(16, 17);
		expect(user.slots).toEqual(expectedLocalizedSlots);
	});
	it('UTC hours', () => {
		const user = new User('John', 'America/Toronto');
		user.addTodaySlot(22, 23, false);
		expect(user.slots).toEqual(expectedLocalizedSlots);
	});
});

describe('User slot conversion', () => {
	it('UTC to EST', () => {
		const user = new User('John', 'America/Toronto');
		const inputSlot = {
			utcStart: parse('03/03/2023 22:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
			utcEnd: parse('03/03/2023 22:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
		};
		expect(user.toLocal(inputSlot)).toMatchObject({
			utcStart: parse('03/03/2023 22:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
			utcEnd: parse('03/03/2023 22:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
			localStart: parse('03/03/2023 16:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
			localEnd: parse('03/03/2023 16:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
		});
	});
});

describe('Slot matching test', () => {
	it('have the same intervals', () => {
		const user1 = {
			slots: [
				{
					utcStart: parse('03/03/2023 22:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 22:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				}
			]
		};
		const user2 = {
			slots: [
				{
					utcStart: parse('03/03/2023 22:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 22:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				}
			]
		};
		const actual = matchingSlots(user1, user2);
		expect(actual.length).toBe(1);
		expect(actual).toMatchObject([
			{
				utcStart: parse('03/03/2023 22:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
				utcEnd: parse('03/03/2023 22:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
			}
		]);
	});
	it('have not an intersection', () => {
		const user1 = {
			slots: [
				{
					utcStart: parse('03/03/2023 12:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 12:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				}
			]
		};
		const user2 = {
			slots: [
				{
					utcStart: parse('03/03/2023 22:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 22:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				}
			]
		};
		const actual = matchingSlots(user1, user2);
		expect(actual.length).toBe(0);
	});
	it('have a partial intersection', () => {
		const user1 = {
			slots: [
				{
					utcStart: parse('03/03/2023 12:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 14:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				}
			]
		};
		const user2 = {
			slots: [
				{
					utcStart: parse('03/03/2023 13:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 15:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				}
			]
		};
		const actual = matchingSlots(user1, user2);
		expect(actual.length).toBe(1);
		expect(actual).toMatchObject([
			{
				utcStart: parse('03/03/2023 13:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
				utcEnd: parse('03/03/2023 14:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
			}
		]);
	});
	it('have 2 partial intersection', () => {
		const user1 = {
			slots: [
				{
					utcStart: parse('03/03/2023 12:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 14:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				}
			]
		};
		const user2 = {
			slots: [
				{
					utcStart: parse('03/03/2023 13:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 15:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				},
				{
					utcStart: parse('03/03/2023 10:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
					utcEnd: parse('03/03/2023 12:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
				}
			]
		};
		const actual = matchingSlots(user1, user2);
		expect(actual.length).toBe(2);
		expect(actual).toMatchObject([
			{
				utcStart: parse('03/03/2023 13:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
				utcEnd: parse('03/03/2023 14:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
			},
			{
				utcStart: parse('03/03/2023 12:17:00', 'dd/MM/yyyy HH:mm:ss', utcDate()),
				utcEnd: parse('03/03/2023 12:29:00', 'dd/MM/yyyy HH:mm:ss', utcDate())
			}
		]);
	});
});
