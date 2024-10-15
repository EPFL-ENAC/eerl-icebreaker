<template>
  <div>
    <div class="bg-white float-left"
      style="
      position: absolute;
      top: 0px;
      right: auto;
      bottom: auto;
      left: 0;
      z-index: 1000;">
      <q-btn
        flat
        no-caps
        color="primary"
        size="12px"
        icon="arrow_upward"
        :label="$t('fly_to_arctic')"
        @click="flyTo([90, 0])"
        align="left"
      />
      <q-btn
        flat
        no-caps
        color="primary"
        size="12px"
        icon="arrow_downward"
        :label="$t('fly_to_antarctic')"
        @click="flyTo([-90, 0])"
        align="left"
      />
    </div>
    <div id="globe" />
  </div>
</template>

<script setup lang="ts">
import { Viewer, Cartesian3, PolylineOutlineMaterialProperty, Color, defined } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Campaign } from 'src/models';
import { cdnUrl } from 'src/boot/api';
import Papa from 'papaparse';

const mapStore = useMapStore();

const globe = ref<Viewer | null>(null);

onMounted(() => {
  initialize('globe');
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

function initialize(id: string) {
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
      pixelSize: 20,
      color: Color.GREEN,
    },
  });

  if (campaign.end_location) {
    globe.value.entities.add({
      name: campaign.acronym,
      position: Cartesian3.fromDegrees(end[1], end[0]),
      point: {
        pixelSize: 20,
        color: Color.RED,
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
      const trackUrl = `${cdnUrl}campaigns/${campaign.acronym}/${campaign.track.file}`;
      const columns = campaign.track.columns;
      Papa.parse(trackUrl, {
        download: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        header: true,
        delimiter: ',',
        complete: function(results) {
          if (results.errors.length > 0) {
            console.error('Error parsing track file', results.errors);
            return;
          }
          const trackLine: number[] = [];
          results.data.forEach((line: { [key: string]: string | number}) => {
            trackLine.push(line[columns.longitude || 'longitude'] as number);
            trackLine.push(line[columns.latitude || 'latitude'] as number);
          });
          addTrack(campaign, trackLine);
        },
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