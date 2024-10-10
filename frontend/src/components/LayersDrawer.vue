<template>
  <q-list>
    <q-item-label header>
      
    </q-item-label>
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
        class="full-width"
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
        class="full-width"
      />
    </q-item>

    <q-item>
      <q-select
        v-model="mapStore.tileLayer"
        :options="tileLayers"
        :label="$t('base_map')"
        dense
        outlined
        map-options
        emit-value
        class="full-width"
        @update:model-value="mapStore.applyTileLayer"
      />
    </q-item>
  </q-list>
</template>

<script lang="ts">
export default defineComponent({
  name: 'LayersDrawer',
});
</script>
<script setup lang="ts">
const mapStore = useMapStore();

const tileLayers = [
  { value: 'satellite', label: 'Satellite' },
  { value: 'osm', label: 'OSM' },
];

function panTo(coords: [number, number]) {       
  mapStore.panTo(coords);
}
</script>
