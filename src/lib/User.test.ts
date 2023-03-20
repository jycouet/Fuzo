import { describe, it, expect } from 'vitest';
import { matchingSlots, User } from './User';
import { set } from 'date-fns';

function utcDate(day: number, hour: number, minute: number): number {
	return Date.UTC(2023, 3 - 1, day, hour, minute, 0, 0);
}

describe('User JSON', () => {
	it('to JSON', () => {
		const user = new User('John', 'America/Toronto');
		user.addDateSlot(new Date(utcDate(18, 20, 28)), new Date(utcDate(18, 21, 28)));
		expect(JSON.stringify(user)).toBe(
			'{"_u":{"n":"John","t":"America/Toronto","sl":[{"s":1679189280000,"e":1679192880000}]}}'
		);
	});
	it('from JSON', () => {
		const input =
			'{"_u":{"n":"John","t":"America/Toronto","sl":[{"s":1679189280000,"e":1679182880000}]}}';
		const output: User = JSON.parse(input, User.reviver);
		expect(output).toBeInstanceOf(User);
		expect(output.name).toBe('John');
		expect(output.timezone).toBe('America/Toronto');
		expect(output.slots).toEqual([
			{
				start: 1679189280000,
				end: 1679182880000
			}
		]);
	});
	it('from list JSON', () => {
		const input =
			'[{"_u":{"n":"John","t":"America/Toronto","sl":[{"s":1679189280000,"e":1679182880000}]}},{"_u":{"n":"Doe","t":"Europe/Paris","sl":[{"s":1679189280000,"e":1679182880000}]}}]';
		const output: Array<User> = JSON.parse(input, User.reviver);
		expect(output).toHaveLength(2);

		expect(output[0]).toBeInstanceOf(User);
		expect(output[0].name).toBe('John');
		expect(output[0].timezone).toBe('America/Toronto');

		expect(output[1]).toBeInstanceOf(User);
		expect(output[1].name).toBe('Doe');
		expect(output[1].timezone).toBe('Europe/Paris');
		expect(output[1].slots).toEqual([
			{
				start: 1679189280000,
				end: 1679182880000
			}
		]);
	});
});

describe('User addTodaySlot', () => {
	const expectedLocalizedSlots = [
		{
			start: set(new Date(), { hours: 21, minutes: 0, seconds: 0, milliseconds: 0 }).getTime(),
			end: set(new Date(), { hours: 22, minutes: 0, seconds: 0, milliseconds: 0 }).getTime()
		}
	];

	it('Local hours', () => {
		const user = new User('John', 'America/Toronto');
		user.addTodaySlot(16, 17);
		expect(user.slots).toEqual(expectedLocalizedSlots);
	});
	it('UTC hours', () => {
		const user = new User('John', 'America/Toronto');
		user.addTodaySlot(21, 22, false);
		expect(user.slots).toEqual(expectedLocalizedSlots);
	});
});

describe('User slot conversion', () => {
	it('UTC to EST', () => {
		const user = new User('John', 'America/Toronto');
		const inputSlot = {
			start: utcDate(3, 22, 17),
			end: utcDate(3, 22, 29)
		};
		expect(user.format(inputSlot, 'dd/MM/yyyy HH:mm:ss')).toMatchObject({
			start: '03/03/2023 17:17:00',
			end: '03/03/2023 17:29:00'
		});
	});
});

describe('Slot matching test', () => {
	it('have the same intervals', () => {
		const user1 = {
			slots: [
				{
					start: utcDate(3, 22, 17),
					end: utcDate(3, 22, 29)
				}
			]
		};
		const user2 = {
			slots: [
				{
					start: utcDate(3, 22, 17),
					end: utcDate(3, 22, 29)
				}
			]
		};
		const actual = matchingSlots(user1, user2);
		expect(actual.length).toBe(1);
		expect(actual).toMatchObject([
			{
				start: utcDate(3, 22, 17),
				end: utcDate(3, 22, 29)
			}
		]);
	});
	it('have not an intersection', () => {
		const user1 = {
			slots: [
				{
					start: utcDate(3, 12, 17),
					end: utcDate(3, 12, 29)
				}
			]
		};
		const user2 = {
			slots: [
				{
					start: utcDate(3, 22, 17),
					end: utcDate(3, 22, 29)
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
					start: utcDate(3, 12, 17),
					end: utcDate(3, 14, 29)
				}
			]
		};
		const user2 = {
			slots: [
				{
					start: utcDate(3, 13, 17),
					end: utcDate(3, 15, 29)
				}
			]
		};
		const actual = matchingSlots(user1, user2);
		expect(actual.length).toBe(1);
		expect(actual).toMatchObject([
			{
				start: utcDate(3, 13, 17),
				end: utcDate(3, 14, 29)
			}
		]);
	});
	it('have 2 partial intersection', () => {
		const user1 = {
			slots: [
				{
					start: utcDate(3, 12, 17),
					end: utcDate(3, 14, 29)
				}
			]
		};
		const user2 = {
			slots: [
				{
					start: utcDate(3, 13, 17),
					end: utcDate(3, 15, 29)
				},
				{
					start: utcDate(3, 10, 17),
					end: utcDate(3, 12, 29)
				}
			]
		};
		const actual = matchingSlots(user1, user2);
		expect(actual.length).toBe(2);
		expect(actual).toMatchObject([
			{
				start: utcDate(3, 13, 17),
				end: utcDate(3, 14, 29)
			},
			{
				start: utcDate(3, 12, 17),
				end: utcDate(3, 12, 29)
			}
		]);
	});
});
