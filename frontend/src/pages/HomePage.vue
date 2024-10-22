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
        <q-splitter
          v-model="split"
          :horizontal="$q.screen.lt.md"
        >
          <template v-slot:before>
            <azimuth-view id="north" projection="EPSG:3995" :embed="isEmbeded" />
          </template>

          <template v-slot:separator>
            <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
          </template>
          <template v-slot:after>
            <azimuth-view id="south" projection="EPSG:3031" :embed="isEmbeded" />
          </template>
        </q-splitter> 
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
import AzimuthView from 'src/components/map/AzimuthView.vue';
import { Settings } from 'src/stores/settings';

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const mapStore = useMapStore();

const split = ref(50);
const showCampaign = ref(false);

const isEmbeded = computed(() => route.query.embed !== undefined && route.query.embed !== 'false' && route.query.embed !== '0');

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
