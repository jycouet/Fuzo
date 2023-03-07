import {
	geoAzimuthalEqualArea,
	geoAzimuthalEquidistant,
	geoConicConformal,
	geoConicEqualArea,
	geoConicEquidistant,
	geoEqualEarth,
	geoEquirectangular,
	geoGnomonic,
	geoMercator,
	geoNaturalEarth1,
	geoOrthographic,
	geoStereographic,
	geoTransverseMercator
} from 'd3-geo';
import type { GeoProjection } from 'd3-geo';

export const PROJECTION_MAP: Record<string, () => GeoProjection> = {
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
