import { defineStore } from 'pinia';
import { Campaign } from 'src/models';
import { api, cdnUrl } from 'src/boot/api';
import { CsvLine, CsvParseCallback } from 'src/components/models';
import Papa from 'papaparse';

export const useMapStore = defineStore('map', () => {

  const tileLayer = ref<string>('osm');
  const selectedCampaign = ref<Campaign | null>(null);
  const campaignsLoaded = ref(false);
  const campaigns = ref<Campaign[]>([]);
  const showGlobe = ref(false);
  const tracks = ref<{ [key: string]: CsvLine[] }>();

  async function loadCampaigns() {
    campaignsLoaded.value = false;
    campaigns.value = [];
    tracks.value = {};
    const resp = await api.get('/catalog/campaigns');
    campaigns.value = resp.data;
    campaignsLoaded.value = true;
  }

  function getTrackData(campaign: Campaign, callback: CsvParseCallback) {
    if (!campaign.track) return callback([]);
    const trackUrl = `${cdnUrl}/${campaign.track.file.path}`;
    if (tracks.value && tracks.value[trackUrl]) {
      return callback(tracks.value[trackUrl]);
    }
    const columns = campaign.track.columns;
    Papa.parse(trackUrl, {
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      header: true,
      delimiter: ',',
      complete: function(results) {
        if (results.errors.length > 0) {
          console.error('Error parsing track file', results.errors);
          return;
        }
        tracks.value = tracks.value || {};
        tracks.value[trackUrl] = results.data.filter((line: CsvLine) => {
          return isNumber(line[columns.latitude]) && isNumber(line[columns.longitude]);
        });
        callback(tracks.value[trackUrl]);
      },
    });
  }

  function isNumber(value: string | number): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  return {
    tileLayer,
    selectedCampaign,
    campaignsLoaded,
    campaigns,
    showGlobe,
    loadCampaigns,
    getTrackData,
  };
});