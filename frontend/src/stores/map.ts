import { defineStore } from 'pinia';
import { Expedition, ExpeditionStore } from 'src/models';
import expeditionsDef from 'assets/expeditions.json';

export const useMapStore = defineStore('map', () => {

  const map = ref<WE.Map | null>(null);
  const tileLayer = ref<string>('osm');
  const selectedExpedition = ref<Expedition | null>(null)  

  function initialize(id: string) {
    map.value = new WE.map(id, {
            center: [90, 0],
            altitude: 15000000,
          });
    applyTileLayer();
    tileLayer.value = 'satellite';
    applyTileLayer();
    (expeditionsDef as ExpeditionStore).expeditions.forEach((exp: Expedition) => initExpedition(exp));
  }

  function initExpedition(expedition: Expedition) {
    const start = expedition.start_location;
    const end = expedition.end_location ? expedition.end_location : start;
    console.log(start, end);

    const marker = WE.marker(start).addTo(map.value);
    WE.marker(end).addTo(map.value);
    marker.on('click', function() {
      selectedExpedition.value = expedition;
    });

    const polygonA = WE.linestring([
        start,
        end,
      ], {
        color: '#ff0',
        opacity: 1,
        fillColor: '#f00',
        fillOpacity: 0.1,
        editable: false,
        weight: 2
    });
    polygonA.addTo(map.value);
  }

  function applyTileLayer() {
    if (tileLayer.value === 'osm') {
      WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
    } else if (tileLayer.value === 'satellite') {
      WE.tileLayer('https://webglearth.github.io/webglearth2-offline/{z}/{x}/{y}.jpg', {
        tileSize: 256,
        bounds: [[-85, -180], [85, 180]],
        minZoom: 0,
        maxZoom: 16,
        attribution: 'EPFL EERL',
        tms: true
      }).addTo(map.value);
    }
  }

  function panTo(coords: [number, number]) {
    map.value.panTo(coords);
  }

  return {
    map,
    tileLayer,
    selectedExpedition,
    initialize,
    panTo,
    applyTileLayer,
  };
});