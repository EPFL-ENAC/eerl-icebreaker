import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', () => {

  const map = ref<WE.Map | null>(null);
  const tileLayer = ref<string>('osm');

  function initialize(id: string) {
    map.value = new WE.map(id, {
            center: [90, 0],
            altitude: 15000000,
          });
    applyTileLayer();
    tileLayer.value = 'satellite';
    applyTileLayer();

    initMosaic();
  }

  function initMosaic() {
    const marker = WE.marker([85.0610662, 136.9671595]).addTo(map.value);
    marker.bindPopup('<b>MOSAiC</b><br>Multidisciplinary drifting Observatory for the Study of Arctic Climate', {maxWidth: 150, closeButton: true}).openPopup();

    const polygonA = WE.polygon([[49.5608, 5.811], [49.986, 5.723],
      [50.190, 6.086], [49.781, 6.536], [49.468, 6.372], [49.560, 5.811]]
            );
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
    initialize,
    panTo,
    applyTileLayer,
  };
});