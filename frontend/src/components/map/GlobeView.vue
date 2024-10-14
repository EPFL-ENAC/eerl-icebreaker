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
      <q-list>
        <q-item>
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
        </q-item>
        <q-item>
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
        </q-item>
      </q-list>
    </div>
    <div id="globe" />
  </div>
</template>

<script setup lang="ts">
import { Viewer, Cartesian3, PolylineOutlineMaterialProperty, Color, defined } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Expedition, ExpeditionStore } from 'src/models';

const mapStore = useMapStore();

const globe = ref<Viewer | null>(null);

onMounted(() => {
  initialize('globe');
});

watch(
  () => mapStore.selectedExpedition,
  () => {
    if (!mapStore.selectedExpedition && globe.value) {
      // apply deselection
      globe.value.selectedEntity = undefined;
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
  (mapStore.expeditionsDef as ExpeditionStore).expeditions.forEach((exp: Expedition) => initExpedition(exp));
}

function initExpedition(expedition: Expedition) {
  if (!globe.value) return;
  const start = expedition.start_location;
  const end = expedition.end_location ? expedition.end_location : start;
  console.log(start, end);

  globe.value.entities.add({
    name: expedition.acronym,
    position: Cartesian3.fromDegrees(start[1], start[0]),
    point: {
      pixelSize: 20,
      color: Color.YELLOW,
    },
  });

  globe.value.selectedEntityChanged.addEventListener(function(selectedEntity) {
    if (defined(selectedEntity) && defined(selectedEntity.name) && selectedEntity.name === expedition.acronym) {
      console.log('Selected ' + selectedEntity.name);
      console.log(selectedEntity);
      mapStore.selectedExpedition = expedition;
    } else {
      console.log('Deselected.');
    }
  });

  globe.value.entities.add({
    name: `${expedition.acronym}-track`,
    polyline: {
      positions: Cartesian3.fromDegreesArray([start[1], start[0], end[1], end[0]]),
      width: 3,
      material: new PolylineOutlineMaterialProperty({
        color: Color.ORANGE,
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