<template>
  <div>
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
          @click="mapStore.panTo([90, 0])"
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
          @click="mapStore.panTo([-90, 0])"
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
