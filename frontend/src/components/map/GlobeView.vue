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
            @click="panTo([90, 0])"
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
            @click="panTo([-90, 0])"
            align="left"
          />
        </q-item>
      </q-list>
    </div>
    <div id="globe" />
  </div>
</template>

<script setup lang="ts">
import { Expedition, ExpeditionStore } from 'src/models';

const mapStore = useMapStore();

const globe = ref<WE.Map | null>(null);

onMounted(() => {
  initialize('globe');
});

watch(() => mapStore.tileLayer, () => {
  applyTileLayer();
});

function initialize(id: string) {
  globe.value = new WE.map(id, {
    center: [90, 0],
    altitude: 15000000,
  });
  applyTileLayer();
  mapStore.tileLayer = 'satellite';
  applyTileLayer();
  (mapStore.expeditionsDef as ExpeditionStore).expeditions.forEach((exp: Expedition) => initExpedition(exp));
}

function initExpedition(expedition: Expedition) {
  const start = expedition.start_location;
  const end = expedition.end_location ? expedition.end_location : start;
  console.log(start, end);

  const marker = WE.marker(start).addTo(globe.value);
  WE.marker(end).addTo(globe.value);
  marker.on('click', function() {
    mapStore.selectedExpedition = expedition;
  });

  const polygonA = WE.polygon([
      start,
      end,
    ], {
      color: '#ff0',
      opacity: 1,
      fillColor: '#f00',
      fillOpacity: 0.1,
      editable: false,
      weight: 2
  });
  polygonA.addTo(globe.value);
}

function applyTileLayer() {
  if (mapStore.tileLayer === 'osm') {
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(globe.value);
  } else if (mapStore.tileLayer === 'satellite') {
    WE.tileLayer('https://webglearth.github.io/webglearth2-offline/{z}/{x}/{y}.jpg', {
      tileSize: 256,
      bounds: [[-85, -180], [85, 180]],
      minZoom: 0,
      maxZoom: 16,
      attribution: 'EPFL EERL',
      tms: true
    }).addTo(globe.value);
  }
}

function panTo(coords: [number, number]) {
  globe.value.panTo(coords);
}
</script>