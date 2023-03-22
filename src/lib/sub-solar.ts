import { format } from 'date-fns';

function sunDeclination(dayOfYear: number) {
	// https://www.pveducation.org/pvcdrom/properties-of-sunlight/declination-angle
	return -23.45 * Math.cos(((360 / 365) * (dayOfYear + 10) * Math.PI) / 180);
}
function sunNoon(time: Date) {
	// https://en.wikipedia.org/wiki/Subsolar_point
	const timeMinute =
		(time.getUTCSeconds() + time.getUTCMinutes() * 60 + time.getUTCHours() * 3600) / 60;
	const midDayMinute = 12 * 60;
	const dayOfYear = parseInt(format(time.getTime(), 'D', { useAdditionalDayOfYearTokens: true }));
	const elapsedMinutes = midDayMinute - timeMinute;
	return ((elapsedMinutes - equationOfTime(dayOfYear)) / (60 * 24)) * 360;
}
function equationOfTime(dayOfYear: number) {
	// https://www.intmath.com/blog/mathematics/the-equation-of-time-5039
	return (
		-7.655 * Math.sin((2 * dayOfYear * Math.PI) / 365) +
		9.873 * Math.sin((4 * dayOfYear * Math.PI) / 365 + 3.588)
	);
}
export function subSolar(date: Date): { lat: number; lon: number; coord: [number, number] } {
	const [lat, lon] = [
		sunDeclination(parseInt(format(date, 'D', { useAdditionalDayOfYearTokens: true }))),
		sunNoon(date)
	];
	return {
		lat: lat,
		lon: lon,
		coord: [lon, lat]
	};
}
