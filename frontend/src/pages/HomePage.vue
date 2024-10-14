<template>
  <q-page class="bg-black">
    <globe-view />

    <simple-dialog 
      v-if="mapStore.selectedExpedition"
      v-model="showExpedition"
      :title="mapStore.selectedExpedition.acronym"
      width="800px"
      @update:model-value="onShowExpeditionUpdated">
      <expedition-view :expedition="mapStore.selectedExpedition" />
    </simple-dialog>
  </q-page>
</template>

<script setup lang="ts">
import SimpleDialog from 'src/components/SimpleDialog.vue';
import ExpeditionView from 'src/components/ExpeditionView.vue';
import GlobeView from 'src/components/map/GlobeView.vue';

const mapStore = useMapStore();

const showExpedition = ref(false);

onMounted(() => {
  mapStore.loadExpeditions();
});

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
