import { defineStore } from 'pinia';
import { CampaignStore, Campaign } from 'src/models';
import { cdnUrl } from 'src/boot/api';
import axios from 'axios';
import { CsvLine, CsvParseCallback } from 'src/components/models';
import Papa from 'papaparse';

export const useMapStore = defineStore('map', () => {

  const tileLayer = ref<string>('osm');
  const selectedCampaign = ref<Campaign | null>(null);
  const campaignsLoaded = ref(false);
  const campaignsStore = ref<CampaignStore | null>(null);
  const campaigns = ref<Campaign[]>([]);
  const showGlobe = ref(false);
  const tracks: { [key: string]: CsvLine[] } = ref({});

  async function loadCampaigns() {
    campaignsLoaded.value = false;
    campaigns.value = [];
    // get index.json from cdnUrl
    const resp = await axios.get(`${cdnUrl}campaigns/index.json`);
    campaignsStore.value = resp.data;

    // get the campaigns
    if (campaignsStore.value) {
      await Promise.all(campaignsStore.value.campaigns
        .map((name: string) => axios.get(`${cdnUrl}campaigns/${name}/index.json`).then((resp) => campaigns.value.push(resp.data))));
      campaignsLoaded.value = true;
    }
  }

  function getTrackData(campaign: Campaign, callback: CsvParseCallback) {
    if (!campaign.track) return callback([]);
    const trackUrl = `${cdnUrl}campaigns/${campaign.acronym}/${campaign.track.file}`;
    if (tracks.value[trackUrl]) {
      return callback(tracks.value[trackUrl]);
    }
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
        tracks.value[trackUrl] = results.data;
        callback(results.data);
      },
    });
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