<template>
  <div :style="`background-color: ${isSouthPole ? '#f2efe9' : '#aad3df'};`">
    <div :id="id" style="height: 94vh;"></div>
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
import OSM from 'ol/source/OSM';
import { fromLonLat, get } from 'ol/proj';
import { Feature } from 'ol';
import { Point, LineString } from 'ol/geom';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { Campaign } from 'src/models';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Select from 'ol/interaction/Select';
import { CsvLine } from 'src/components/models';

interface Props {
  id: string;
  projection: string;
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

function initialize() {
  selectInteractions.value = [];
  const stereographicPole = get(props.projection);
  if (!stereographicPole) {
    console.error('Projection not found');
    return;
  }
  map.value = new Map({
    target: props.id,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat(isSouthPole.value ? [0, -90] : [0, 90], stereographicPole),
      zoom: 4,
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
        addFeatureLayer(campaign, pointStart, pointEnd, trackFeature);
      });
    } else {
      const trackLine = [
        [start[1], start[0]],
        [end[1], end[0]]
      ]; // default track
      const trackFeature = new Feature({
        geometry: new LineString(trackLine),
      });
      addFeatureLayer(campaign, pointStart, pointEnd, trackFeature);
    }
  }

}

function addFeatureLayer(campaign: Campaign, pointStart: Feature, pointEnd: Feature, trackFeature: Feature) {
  if (!map.value) return;
  const vectorSource = new VectorSource({
    features: [pointStart, pointEnd, trackFeature],
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: 'red' }),
      }),
      stroke: new Stroke({
        color: 'orange',
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
