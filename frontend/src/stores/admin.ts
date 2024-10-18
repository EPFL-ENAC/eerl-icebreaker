import { defineStore } from 'pinia';
import { FileRef } from 'src/models';
import { api } from 'src/boot/api';
import { FileObject } from 'src/components/models';

const authStore = useAuthStore();

export const useAdminStore = defineStore('admin', () => {

  async function uploadTmpFile(file: FileObject): Promise<FileRef> {
    const formData = new FormData();
    formData.append('files', file);
    return api.post('/files/tmp', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data && res.data.length ? res.data[0] : null);
  }

  async function deleteFile(file: FileRef) {
    if (!file.path) return;
    if (!authStore.isAuthenticated) return Promise.reject('Not authenticated');
    return authStore.updateToken().then(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      };
      if (file.alt_path) {
        return Promise.all([
          api.delete(`/files/${file.path}`, config),
          api.delete(`/files/${file.alt_path}`, config),
        ]);
      }
      return api.delete(`/files/${file.path}`, config);
    });
  }

  return {
    uploadTmpFile,
    deleteFile,
  }
});