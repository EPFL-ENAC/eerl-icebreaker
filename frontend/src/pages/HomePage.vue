<template>
  <q-page :class="mapStore.showGlobe ? 'bg-black' : ''">
    <div>
      <q-btn
        no-caps
        color="primary"
        class="on-left"
        :icon="mapStore.showGlobe ? 'map' : 'public'"
        :label="mapStore.showGlobe ? '2D' : '3D'"
        @click="toggleShowGlobe"
        style="
          position: absolute;
          top: 60px;
          right: auto;
          bottom: auto;
          left: 8px;
          z-index: 1000;"
      ></q-btn>
      <div v-if="mapStore.showGlobe">
        <globe-view />
      </div>
      <div v-else>
        <azimuth-views />
      </div>
    </div>
    
    <simple-dialog 
      v-if="mapStore.selectedCampaign"
      v-model="showCampaign"
      :title="mapStore.selectedCampaign.acronym"
      width="900px"
      @update:model-value="onShowCampaignUpdated">
      <campaign-view :campaign="mapStore.selectedCampaign" />
    </simple-dialog>
  </q-page>
</template>

<script setup lang="ts">
import SimpleDialog from 'src/components/SimpleDialog.vue';
import CampaignView from 'src/components/CampaignView.vue';
import GlobeView from 'src/components/map/GlobeView.vue';
import AzimuthViews from 'src/components/map/AzimuthViews.vue';

import { Settings } from 'src/stores/settings';

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
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

function toggleShowGlobe() {
  mapStore.showGlobe = !mapStore.showGlobe;
  settingsStore.saveSettings({ show_globe: mapStore.showGlobe } as Settings);
  if (route.path === '/admin') {
    router.push('/');
  }
}
</script>
