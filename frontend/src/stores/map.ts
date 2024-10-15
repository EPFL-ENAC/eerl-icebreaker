import { defineStore } from 'pinia';
import { CampaignStore, Campaign } from 'src/models';
import { cdnUrl } from 'src/boot/api';
import axios from 'axios';

export const useMapStore = defineStore('map', () => {

  const tileLayer = ref<string>('osm');
  const selectedCampaign = ref<Campaign | null>(null);
  const campaignsLoaded = ref(false);
  const campaignsStore = ref<CampaignStore | null>(null);
  const campaigns = ref<Campaign[]>([]);

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

  return {
    tileLayer,
    selectedCampaign,
    campaignsLoaded,
    campaigns,
    loadCampaigns,
  };
});