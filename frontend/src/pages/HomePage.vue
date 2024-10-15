<template>
  <q-page class="bg-black">
    <globe-view />

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

const mapStore = useMapStore();

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
