import { defineStore } from 'pinia';
import { ExpeditionStore, Expedition } from 'src/models';
import { cdnUrl } from 'src/boot/api';
import axios from 'axios';

export const useMapStore = defineStore('map', () => {

  const tileLayer = ref<string>('osm');
  const selectedExpedition = ref<Expedition | null>(null);
  const expeditionsLoaded = ref(false);
  const expeditionsStore = ref<ExpeditionStore | null>(null);
  const expeditions = ref<Expedition[]>([]);

  async function loadExpeditions() {
    expeditionsLoaded.value = false;
    expeditions.value = [];
    // get index.json from cdnUrl
    const resp = await axios.get(`${cdnUrl}expeditions/index.json`);
    expeditionsStore.value = resp.data;

    // get the expeditions
    if (expeditionsStore.value) {
      await Promise.all(expeditionsStore.value.expeditions
        .map((name: string) => axios.get(`${cdnUrl}expeditions/${name}/index.json`).then((resp) => expeditions.value.push(resp.data))));
      expeditionsLoaded.value = true;
    }
  }

  return {
    tileLayer,
    selectedExpedition,
    expeditionsLoaded,
    expeditions,
    loadExpeditions,
  };
});