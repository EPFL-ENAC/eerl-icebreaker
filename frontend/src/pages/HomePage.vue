<template>
  <q-page :class="mapStore.showGlobe ? 'bg-black' : ''">
    <div v-if="mapStore.showGlobe">
      <globe-view />
    </div>
    <div v-else>
      <q-splitter
        v-model="split"
        :horizontal="$q.screen.lt.md"
        style="height: 94vh"
      >
        <template v-slot:before>
          <azimuth-view id="north" projection="EPSG:3995" />
        </template>

        <template v-slot:separator>
          <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
        </template>
        <template v-slot:after>
          <azimuth-view id="south" projection="EPSG:3031" />
        </template>
      </q-splitter> 
    </div>
    
    <simple-dialog 
      v-if="mapStore.selectedCampaign"
      v-model="showCampaign"
      :title="mapStore.selectedCampaign.acronym"
      width="800px"
      @update:model-value="onShowCampaignUpdated">
      <campaign-view :campaign="mapStore.selectedCampaign" />
    </simple-dialog>
  </q-page>
</template>

<script setup lang="ts">
import SimpleDialog from 'src/components/SimpleDialog.vue';
import CampaignView from 'src/components/CampaignView.vue';
import GlobeView from 'src/components/map/GlobeView.vue';
import AzimuthView from 'src/components/map/AzimuthView.vue';

const mapStore = useMapStore();
const split = ref(50);
const showCampaign = ref(false);

onMounted(() => {
  mapStore.loadCampaigns();
});

watch(
  () => mapStore.selectedCampaign,
  () => {
    showCampaign.value = mapStore.selectedCampaign !== null;
  },
);

function onShowCampaignUpdated() {
  if (!showCampaign.value) {
    mapStore.selectedCampaign = null;
  }
}
</script>
