<template>
  <div :style="`background-color: ${isSouthPole ? '#ffffff' : '#004255'};`">
    <div :id="id" :style="`height: ${embed ? 100 : 94}vh;`"></div>
  </div>
</template>


<script lang="ts">
export default defineComponent({
  name: 'AzimuthView',
});
</script>
<script setup lang="ts">
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { fromLonLat, get } from 'ol/proj';
import { Feature } from 'ol';
import { Point, LineString } from 'ol/geom';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import { Campaign } from 'src/models';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Select from 'ol/interaction/Select';
import { FullScreen, Attribution } from 'ol/control';
import { CsvLine } from 'src/components/models';

interface Props {
  id: string;
  projection: string;
  embed: boolean;
}
const props = defineProps<Props>();

const mapStore = useMapStore();

const map = ref<Map | null>(null);
const selectInteractions = ref<Select[]>([]);

const isSouthPole = computed(() => props.projection === 'EPSG:3031');

onMounted(() => {
  initialize();
  if (mapStore.campaignsLoaded) {
    mapStore.campaigns.forEach((exp: Campaign) => initCampaign(exp)); 
  }
});

watch(
  () => mapStore.campaignsLoaded,
  () => {
    if (mapStore.campaignsLoaded) {
      mapStore.campaigns.forEach((exp: Campaign) => initCampaign(exp)); 
    }
  },
);

watch(
  () => mapStore.selectedCampaign,
  () => {
    if (!mapStore.selectedCampaign && map.value) {
      // apply deselection
      selectInteractions.value.forEach((selectInteraction) => {
        selectInteraction.getFeatures().clear();
      });
    }
  },
);

async function initialize() {
  selectInteractions.value = [];
  const stereographicPole = get(props.projection);
  if (!stereographicPole) {
    console.error('Projection not found');
    return;
  }

const attributions =
  '<a href="https://esri.maps.arcgis.com/home" target="_blank">&copy; Esri World Imagery</a> ' +
  '<a href="https://www.epfl.ch/labs/eerl/" target="_blank">&copy; EPFL - EERL</a>';
  const arcgisWorldImageryLayer = new TileLayer({
    source: new XYZ({
      attributions: attributions,
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 16 // ArcGIS World Imagery max zoom level
    })
  });
  map.value = new Map({
    controls: [new FullScreen(), new Attribution()],
    target: props.id,
    layers: [
      arcgisWorldImageryLayer,
    ],
    view: new View({
      center: fromLonLat(isSouthPole.value ? [0, -90] : [0, 90], stereographicPole),
      zoom: isSouthPole.value ? 3 : 4,
      projection: props.projection,
    }),
  });
}

function initCampaign(campaign: Campaign) {
  if (!map.value) return;
  const stereographicPole = get(props.projection);
  if (!stereographicPole) {
    console.error('Projection not found');
    return;
  }
  const start = campaign.start_location;
  const end = campaign.end_location ? campaign.end_location : start;
  if (isSouthPole.value && start[0] > 0) {
    // draw only features in the hemisphere they belong to
    return;
  }

  const pointStart = new Feature({
    geometry: new Point(fromLonLat([start[1], start[0]], stereographicPole)),
    name: campaign.acronym,
  });
  const pointEnd = new Feature({
    geometry: new Point(fromLonLat([end[1], end[0]], stereographicPole)),
  });

  if (campaign.end_location || campaign.track) {
    if (campaign.track) {
      const columns = campaign.track.columns;
      mapStore.getTrackData(campaign, (lines: CsvLine[]) => {
        const trackLine = lines.map((line: CsvLine) => {
          return fromLonLat([
            line[columns.longitude || 'longitude'] as number,
            line[columns.latitude || 'latitude'] as number,
          ], stereographicPole);
        });
        const trackFeature = new Feature({
          geometry: new LineString(trackLine),
        });
        addFeatureLayer(campaign, [pointStart, pointEnd, trackFeature]);
      });
    } else {
      const trackLine = [
        [start[1], start[0]],
        [end[1], end[0]]
      ]; // default track
      const trackFeature = new Feature({
        geometry: new LineString(trackLine),
      });
      addFeatureLayer(campaign, [pointStart, pointEnd, trackFeature]);
    }
  } else {
    addFeatureLayer(campaign, [pointStart]);
  }

}

function addFeatureLayer(campaign: Campaign, features: [Feature]) {
  if (!map.value) return;
  const vectorSource = new VectorSource({
    features,
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: (feature) => new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: campaign.color ? campaign.color : 'red' }),
      }),
      // Style for the label
      text: new Text({
        font: '16px Calibri,sans-serif',
        fill: new Fill({ color: '#000' }), // Text color
        stroke: new Stroke({ color: '#fff', width: 2 }), // Outline around text
        text: feature.get('name'), // Get the label text from the 'name' property
        offsetY: typeof campaign.offsetY === 'number' ? campaign.offsetY : -15, // Offset to position the label above/beneath the point
        offsetX: typeof campaign.offsetX === 'number' ? campaign.offsetX : 0, // Offset to position the label aside the point
      }),
      stroke: new Stroke({
        color: campaign.track?.color ? campaign.track.color : 'orange',
        width: 3,
      }),
    }),
  });

  map.value.addLayer(vectorLayer);

  // Define a Select interaction
  const selectInteraction = new Select({
    layers: [vectorLayer],
  });
  map.value.addInteraction(selectInteraction);
  selectInteractions.value.push(selectInteraction);

  // Handle the feature selection event
  selectInteraction.on('select', function (e) {
    const selectedFeatures = e.selected;
    if (selectedFeatures.length > 0) {
      mapStore.selectedCampaign = campaign;
    }
  });
}

</script>
