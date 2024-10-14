import { defineStore } from 'pinia';
import { Expedition } from 'src/models';
import expeditionsDef from 'assets/expeditions.json';

export const useMapStore = defineStore('map', () => {

  const tileLayer = ref<string>('osm');
  const selectedExpedition = ref<Expedition | null>(null)  

  return {
    tileLayer,
    selectedExpedition,
    expeditionsDef,
  };
});