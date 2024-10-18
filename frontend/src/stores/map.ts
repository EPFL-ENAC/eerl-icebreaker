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
        tracks.value[trackUrl] = results.data;
        callback(results.data);
      },
    });
  }

  function addCampaign() {
    let id = 1;
    for (const campaign of campaigns.value) {
      if (campaign.id && parseInt(campaign.id) >= id) {
        id = parseInt(campaign.id) + 1;
      }
    }
    campaigns.value.push({
      id: id + '',
      acronym: `campaign-${id}`,
      name: `Campaign ${id}`,
      website: '',
      objectives: '',
      platform: '',
      start_date: '',
      end_date: '',
      start_location: [0, 0],
      end_location: undefined,
      track: undefined,
      images: [],
      fundings: [],
      references: [],
      instruments: [],
    } as Campaign);
  }

  function deleteCampaign(index: number) {
    campaigns.value.splice(index, 1);
  }

  return {
    tileLayer,
    selectedCampaign,
    campaignsLoaded,
    campaigns,
    showGlobe,
    loadCampaigns,
    getTrackData,
    addCampaign,
    deleteCampaign,
  };
});