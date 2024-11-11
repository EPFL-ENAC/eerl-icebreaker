import { Ion } from 'cesium';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

window.CESIUM_BASE_URL = 'cesium';
Ion.defaultAccessToken = '';

// Define the Azimuthal Stereographic projection centered on the North/South Pole
proj4.defs('EPSG:3995', '+proj=stere +lat_0=90 +lon_0=0 +k=1 +datum=WGS84 +units=m +no_defs');
proj4.defs('EPSG:3031', '+proj=stere +lat_0=-90 +lon_0=0 +k=1 +datum=WGS84 +units=m +no_defs');
register(proj4);