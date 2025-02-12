<template>
  <div>
    <div class="bg-white float-left"
      style="
      position: absolute;
      top: 15px;
      right: auto;
      bottom: auto;
      left: 8px;
      z-index: 1000;">
      <q-btn
        flat
        no-caps
        square
        color="primary"
        size="12px"
        icon="north"
        :label="t('fly_to_arctic')"
        @click="flyTo([90, 0])"
        align="left"
      />
      <q-btn
        flat
        no-caps
        square
        color="primary"
        size="12px"
        icon="south"
        :label="t('fly_to_antarctic')"
        @click="flyTo([-90, 0])"
        align="left"
      />
    </div>
    <div id="globe" />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'GlobeView',
});
</script>
<script setup lang="ts">
import { LabelStyle, Viewer, Cartesian3, PolylineOutlineMaterialProperty, Color, defined, HorizontalOrigin, Cartesian2 } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Campaign } from 'src/models';
import { CsvLine } from '../models';

const { t } = useI18n();
const mapStore = useMapStore();

const globe = ref<Viewer | null>(null);

onMounted(() => {
  initialize('globe').then(() => {
    if (mapStore.campaignsLoaded) {
      mapStore.campaigns.forEach((exp: Campaign) => initCampaign(exp)); 
    }
  });
});

watch(
  () => mapStore.selectedCampaign,
  () => {
    if (!mapStore.selectedCampaign && globe.value) {
      // apply deselection
      globe.value.selectedEntity = undefined;
    }
  },
);

watch(
  () => mapStore.campaignsLoaded,
  () => {
    if (mapStore.campaignsLoaded) {
      mapStore.campaigns.forEach((exp: Campaign) => initCampaign(exp)); 
    }
  },
);

async function initialize(id: string) {
  await mapStore.loadCesiumAccessToken();
  globe.value = new Viewer(id, {
    animation: false,
    baseLayerPicker: true,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: true,
    shouldAnimate: true,
    //skyBox: false,
    //skyAtmosphere: false,
    vrButton: false,
    creditContainer: document.createElement('div'),  // Empty div to remove default credits
  });

  flyTo([90, 0], 0);
}

function initCampaign(campaign: Campaign) {
  if (!globe.value) return;
  const start = campaign.start_location;
  const end = campaign.end_location ? campaign.end_location : start;

  globe.value.entities.add({
    name: campaign.acronym,
    position: Cartesian3.fromDegrees(start[1], start[0]),
    point: {
      pixelSize: 10,
      color: campaign.color ? Color.fromCssColorString(campaign.color) : Color.RED,
    },
  });

  const offsetX = typeof campaign.offsetX === 'number' ? campaign.offsetX : 0;
  const offsetY = typeof campaign.offsetY === 'number' ? campaign.offsetY : -15;

  globe.value.entities.add({
    position: Cartesian3.fromDegrees(start[1], start[0]),
    label: {
      text: campaign.acronym,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      font: '20px sans-serif',
      horizontalOrigin: HorizontalOrigin.CENTER,
      pixelOffset: new Cartesian2(offsetX, offsetY),
      style: LabelStyle.FILL_AND_OUTLINE,
    },
  });

  if (campaign.end_location) {
    globe.value.entities.add({
      name: campaign.acronym,
      position: Cartesian3.fromDegrees(end[1], end[0]),
      point: {
        pixelSize: 10,
        color: campaign.color ? Color.fromCssColorString(campaign.color) : Color.RED,
      },
    });
  }

  globe.value.selectedEntityChanged.addEventListener(function(selectedEntity) {
    if (defined(selectedEntity) 
      && defined(selectedEntity.name) 
      && (selectedEntity.name === campaign.acronym || selectedEntity.name === `${campaign.acronym}-track`)) {
      mapStore.selectedCampaign = campaign;
    }
  });

  if (campaign.end_location || campaign.track) {
    if (campaign.track) {
      const columns = campaign.track.columns;
      mapStore.getTrackData(campaign, (lines: CsvLine[]) => {
        const trackLine: number[] = [];
        lines.forEach((line: CsvLine) => {
          trackLine.push(line[columns.longitude || 'longitude'] as number);
          trackLine.push(line[columns.latitude || 'latitude'] as number);
        });
        addTrack(campaign, trackLine);
      });
    } else {
      const trackLine = [start[1], start[0], end[1], end[0]]; // default track
      addTrack(campaign, trackLine);
    }
  }
}

function addTrack(campaign: Campaign, trackLine: number[]) {
  if (!globe.value || trackLine.length === 0) return;
  globe.value.entities.add({
    name: `${campaign.acronym}-track`,
    polyline: {
      positions: Cartesian3.fromDegreesArray(trackLine),
      width: 3,
      material: new PolylineOutlineMaterialProperty({
        color: campaign.track?.color ? Color.fromCssColorString(campaign.track?.color) : Color.ORANGE,
        outlineWidth: 1,
        outlineColor: Color.BLACK,
      }),
    },
  });
}

function flyTo(coords: [number, number], duration = 3) {
  if (!globe.value) return;
  globe.value.camera.flyTo({
    destination: Cartesian3.fromDegrees(coords[1], coords[0], 15000000),
    duration,
  });
}
</script>