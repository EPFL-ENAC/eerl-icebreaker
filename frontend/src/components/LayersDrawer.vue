<template>
  <div>
    <q-list class="q-mt-md">
      <q-item-label header>
        
      </q-item-label>
      <q-item>
        <q-select
          v-model="mapStore.tileLayer"
          :options="tileLayers"
          :label="t('base_map')"
          dense
          outlined
          map-options
          emit-value
          class="full-width"
        />
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'LayersDrawer',
});
</script>
<script setup lang="ts">
const { t } = useI18n();
const mapStore = useMapStore();

const tileLayers = [
  { value: 'satellite', label: 'Satellite' },
  { value: 'osm', label: 'OSM' },
];

</script>
