<template>
  <div>
    <q-list class="q-mt-md">
      <q-item-label header>
        
      </q-item-label>
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
        />
      </q-item>
    </q-list>

    <simple-dialog 
      v-if="mapStore.selectedExpedition"
      v-model="showExpedition"
      :title="mapStore.selectedExpedition.acronym"
      width="800px"
      @update:model-value="onShowExpeditionUpdated">
      <expedition-view :expedition="mapStore.selectedExpedition" />
    </simple-dialog>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'LayersDrawer',
});
</script>
<script setup lang="ts">
import SimpleDialog from 'src/components/SimpleDialog.vue';
import ExpeditionView from 'src/components/ExpeditionView.vue';

const mapStore = useMapStore();

const showExpedition = ref(false);

const tileLayers = [
  { value: 'satellite', label: 'Satellite' },
  { value: 'osm', label: 'OSM' },
];

watch(
  () => mapStore.selectedExpedition,
  () => {
    showExpedition.value = mapStore.selectedExpedition !== null;
  },
);

function onShowExpeditionUpdated() {
  if (!showExpedition.value) {
    mapStore.selectedExpedition = null;
  }
}
</script>
