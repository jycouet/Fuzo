<script lang="ts">
	import { geoPath, geoCircle } from 'd3-geo';
	import _earth from './earth.geo.json';
	import _timezone from './timezones.geo.json';
	import { subSolar } from './sub-solar';
	import { feature } from 'topojson-client';
	import { PROJECTION_MAP } from './map';
	import { tweened } from 'svelte/motion';
	import type { GeoPermissibleObjects } from 'd3-geo';
	import type { Topology } from 'topojson-specification';
	import type { FeatureCollection } from 'geojson';

	// Typings
	const earth = _earth as GeoPermissibleObjects;
	const timezone = _timezone as unknown as Topology;

	export let date = new Date();
	export let height = 512;
	export let width = 512;
	export let angle = 0;
	export let projectionType: keyof typeof PROJECTION_MAP = 'mercator';
	export let timezones: Array<string> = [];
	export let enabletz = false;

	const sunLon = tweened(0);
	const sunLat = tweened(0);

	let projection = PROJECTION_MAP[projectionType]()
		.center([0, 0])
		.translate([width / 2, height / 2])
		.scale(width / (2 * Math.PI))
		.rotate([angle, 0, 0]);

	let tzLayers = enabletz
		? (feature(timezone, timezone.objects.timezones) as unknown as FeatureCollection).features
		: undefined;

	function circularObject(center: [number, number], radius: number) {
		let circle = geoCircle();
		circle.center(center);
		circle.radius(radius);
		return circle;
	}

	let sun = circularObject(subSolar(date).coord, 2);
	let sunHalo = circularObject(subSolar(date).coord, 3);
	let sunshine = circularObject(subSolar(date).coord, 90);

	const sunBodies = [sun, sunHalo, sunshine];

	$: {
		const coord = subSolar(date).coord;
		sunLon.set(coord[0]);
		sunLat.set(coord[1]);
		sunBodies.forEach((body) => body.center([$sunLon, $sunLat]));
		// Reactivity
		sun = sun;
		sunHalo = sunHalo;
		sunshine = sunshine;
	}

	$: tzLayers = enabletz
		? (feature(timezone, timezone.objects.timezones) as unknown as FeatureCollection).features
		: undefined;

	$: {
		projection = PROJECTION_MAP[projectionType]()
			.center([0, 0])
			.translate([width / 2, height / 2])
			.scale(width / (2 * Math.PI))
			.rotate([angle, 0, 0]);
	}
</script>

<svg {width} {height}>
	<defs>
		<radialGradient id="waterShine">
			<stop offset="10%" stop-color="#3388ee" />
			<stop offset="50%" stop-color="#3366dd" />
		</radialGradient>
	</defs>

	<rect {width} {height} x="0" y="0" fill="#001133" />

	<!-- Water -->
	<path
		d={geoPath(projection)(circularObject([-angle - 180, 0], 100)())}
		fill="#3366dd"
		filter="blur(10px)"
	/>
	<path
		d={geoPath(projection)(circularObject([-angle, 0], 100)())}
		fill="url(#waterShine)"
		filter="blur(10px)"
	/>

	<!-- Ground -->
	<path d={geoPath(projection)(earth)} fill="#ffffff" filter="blur(4px)" fill-opacity="25%" />
	<path
		d={geoPath(projection)(earth)}
		fill="#888888"
		filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
	/>

	<!-- timezone -->
	{#if enabletz && tzLayers !== undefined}
		{#each tzLayers as tz}
			<path
				d={geoPath(projection)(tz)}
				fill-opacity="0%"
				fill="red"
				class:visible={timezones.includes(tz.properties?.tz_name1st) ||
					timezones.includes(tz.properties?.name)}
			/>
		{/each}
	{/if}

	<!-- Sun -->
	<path d={geoPath(projection)(sunHalo())} fill="#ffff00" filter="blur(6px)" />
	<path d={geoPath(projection)(sun())} fill="#ffff00" filter="drop-shadow(0 0 2px #c0c080)" />

	<!-- Sun Light -->
	<path d={geoPath(projection)(sunshine())} fill="#ffff00" filter="blur(4px)" fill-opacity="20%" />
</svg>

<style>
	.visible {
		fill-opacity: 50%;
	}
</style>
