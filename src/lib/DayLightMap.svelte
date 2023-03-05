<script lang="ts">
	import {
		geoMercator,
		geoPath,
		geoCircle,
		geoOrthographic,
		geoGnomonic,
		geoAzimuthalEqualArea,
		geoAzimuthalEquidistant,
		geoConicConformal,
		geoConicEqualArea,
		geoConicEquidistant,
		geoEqualEarth,
		geoEquirectangular,
		geoNaturalEarth1,
		geoStereographic,
		geoTransverseMercator
	} from 'd3-geo';
	import earth from './earth.geo.json';
	import { subSolar } from './sub-solar';
	import { utcDate } from './time';

	export let date = utcDate();
	export let height = 512;
	export let width = 512;
	export let angle = 0;
	export let projectionType: keyof typeof PROJECTION_MAP = 'mercator';

	const PROJECTION_MAP = {
		transverseMercator: geoTransverseMercator,
		stereographic: geoStereographic,
		naturalEarth1: geoNaturalEarth1,
		equirectangular: geoEquirectangular,
		equalEarth: geoEqualEarth,
		conicEquidistant: geoConicEquidistant,
		conicEqualArea: geoConicEqualArea,
		conicConformal: geoConicConformal,
		azimuthalEquidistant: geoAzimuthalEquidistant,
		azimuthalEqualArea: geoAzimuthalEqualArea,
		gnomonic: geoGnomonic,
		orthographic: geoOrthographic,
		mercator: geoMercator
	};

	let projection = PROJECTION_MAP[projectionType]()
		.center([0, 0])
		.translate([width / 2, height / 2])
		.scale(width / (2 * Math.PI))
		.rotate([angle, 0, 0]);

	function circularObject(center: Array<number>, radius: number) {
		let circle = geoCircle();
		circle.center(center);
		circle.radius(radius);
		return circle;
	}

	let sun = circularObject(subSolar(date).coord, 2);
	let sunHalo = circularObject(subSolar(date).coord, 4);
	let sunshine = circularObject(subSolar(date).coord, 90);

	const sunBodies = [sun, sunHalo, sunshine];

	$: {
		sunBodies.forEach((body) => body.center(subSolar(date).coord));
		// Reactivity
		sun = sun;
		sunHalo = sunHalo;
		sunshine = sunshine;
	}

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
	<path d={geoPath(projection)(earth)} fill="#888888" />

	<!-- Sun -->
	<path d={geoPath(projection)(sun())} fill="#ffff00" />
	<path d={geoPath(projection)(sunHalo())} fill="#ffff00" filter="blur(6px)" />

	<!-- Sun Light -->
	<path d={geoPath(projection)(sunshine())} fill="#ffff00" filter="blur(4px)" fill-opacity="20%" />
</svg>
<select bind:value={projectionType}
	>{#each Object.keys(PROJECTION_MAP) as value}<option>{value}</option>{/each}</select
>
<input type="range" min="0" max="360" step="1" bind:value={angle} />
