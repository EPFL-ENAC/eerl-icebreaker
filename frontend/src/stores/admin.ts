import { defineStore } from 'pinia';
import { FileRef } from 'src/models';
import { api } from 'src/boot/api';
import { FileObject } from 'src/components/models';
import { Campaign } from 'src/models';

const authStore = useAuthStore();

export const useAdminStore = defineStore('admin', () => {
  
  const campaigns = ref<Campaign[]>([]);
  const campaignsToDelete = ref<Campaign[]>([]);
  const filesToDelete = ref<FileRef[]>([]);

  function initCampaigns(originalCampaigns: Campaign[]) {
    // deep copy
    campaigns.value = JSON.parse(JSON.stringify(originalCampaigns));
    filesToDelete.value = [];
    campaignsToDelete.value = [];
  }

  async function uploadTmpFile(file: FileObject): Promise<FileRef> {
    const formData = new FormData();
    formData.append('files', file);
    return api.post('/files/tmp', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data && res.data.length ? res.data[0] : null);
  }

  function addFileToDelete(file: FileRef) {
    filesToDelete.value.push(file);
  }

  async function deleteFile(file: FileRef, config: any) {
    if (!file.path) return Promise.resolve();
    const promises = [];
    if (file.alt_path) {
      promises.push(api.delete(`/files/${file.alt_path}`, config));
    }
    promises.push(api.delete(`/files/${file.path}`, config));
    return Promise.all(promises);
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

  function addCampaignToDelete(index: number) {
    campaignsToDelete.value.push(campaigns.value[index]);
    campaigns.value.splice(index, 1);
  }

  function hasChanges(originalCampaigns: Campaign[]) {
    return filesToDelete.value.length > 0 || JSON.stringify(campaigns.value) !== JSON.stringify(originalCampaigns);
  }

  async function saveCampaigns() {
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      const promises = [];
      // delete files
      for (const file of filesToDelete.value) {
        promises.push(deleteFile(file, config));
      }
      filesToDelete.value = [];
      // delete campaigns (and associated files)
      for (const campaign of campaignsToDelete.value) {
        promises.push(api.delete(`/catalog/campaign/${campaign.id}`, config));
      }
      campaignsToDelete.value = [];
      // create or update campaigns (and move temp files to permanent location)
      return Promise.all(promises).then(() => api.post('/catalog/campaigns', campaigns.value, config));
    });
  }

  return {
    campaigns,
    filesToDelete,
    initCampaigns,
    addCampaign,
    addCampaignToDelete,
    saveCampaigns,
    uploadTmpFile,
    addFileToDelete,
    hasChanges,
  }
});