<template>
  <q-page>
    <div class="text-h4 q-pa-md bg-accent text-white text-weight-light">
      {{ $t('administration') }}
    </div>
    <q-toolbar v-if="authStore.isAuthenticated" class="bg-warning">
      <span>{{ $t(authStore.isAdmin ? 'user.welcome_admin' : 'user.welcome', { name: authStore.profile?.firstName }) }}</span>
      <q-btn
        color="primary"
        no-caps
        :label="$t('user.logout')"
        @click="authStore.logout" 
        size="sm"
        class="on-right"
      />
    </q-toolbar>
    <div class="q-pa-md">
      <div v-if="!authStore.isAuthenticated">
        <q-spinner-dots size="md" color="primary" />
      </div>
      <div v-else-if="authStore.isAdmin">
        <div class="text-h5">
          {{ $t('campaigns') }}
        </div>
        <div class="text-help q-mb-md">
          {{ $t('campaigns_info') }}
        </div>
        <div class="q-mb-md">
          <q-btn
            @click="onSave"
            :color="hasChanges && !loading ? 'accent' : 'grey-6'"
            :label="$t('save')"
            icon="cloud_upload"
            size="sm"
            :disable="loading || !hasChanges"
          />
          <q-btn
            @click="onReload"
            :label="$t('reload')"
            icon="refresh"
            size="sm"
            class="on-right"
            :disable="loading"
          />
          <q-btn
            v-show="!loading && campaigns.length === 0"
            @click="onAdd"
            color="secondary"
            :label="$t('add')"
            icon="add"
            size="sm"
            class="on-right"
          />
        </div>
        <div v-if="campaigns.length">
          <div class="row q-gutter-md">
            <div class="col" style="max-width: 200px;">
              <div class="q-mb-md q-mt-sm">
                <div v-for="(campaign, i) in campaigns"
                :key="campaign.id">
                  <q-btn
                    flat
                    no-caps
                    :label="campaign.acronym"
                    align="left"
                    size="12px"
                    class="full-width"
                    :class="`${selected === i ? 'bg-light-blue-1' : ''}`"
                    @click="selected = i"
                  />
                </div>
              </div>
              <q-btn v-show="!loading" @click="onAdd" color="secondary" :label="$t('add')" icon="add" size="sm" class="full-width"/>
            </div>
            <div class="col" v-if="selected !== null && campaigns">
              <div>
                <q-toolbar>
                  <q-icon name="directions_boat" class="q-mr-xs" size="sm"/>
                  <span class="text-h6">{{ campaigns[selected].acronym }}</span>
                  <q-space />
                  <q-btn
                    v-if="selected !== null"
                    rounded
                    dense
                    flat
                    color="negative"
                    :title="$t('delete')"
                    icon="delete"
                    @click="onDelete(selected)"
                  />
                  <q-btn
                    v-if="selected !== null"
                    rounded
                    dense
                    flat
                    size="sm"
                    :title="$t('previous')"
                    icon="arrow_back_ios"
                    class="on-right"
                    :disable="selected === 0"
                    @click="selected = selected !== null ? selected - 1 : null"
                  />
                  <q-btn
                    v-if="selected !== null"
                    rounded
                    dense
                    flat
                    size="sm"
                    :title="$t('next')"
                    icon="arrow_forward_ios"
                    class="q-ml-xs"
                    :disable="selected === campaigns.length - 1"
                    @click="selected = selected !== null ? selected + 1 : null"
                  />
                </q-toolbar>
              </div>
              <q-separator class="q-mb-md"/>
              <campaign-form v-model="campaigns[selected]" />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <q-card class="bg-negative text-white">
          <q-card-section>
            {{ $t('user.not_admin') }}
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showReload">
      <q-card style="width: 500px; max-width: 90hw;">
        <q-card-section>
          {{ $t('reload_confirmation') }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('cancel')"
            color="secondary"
            v-close-popup
          />
          <q-btn
            :label="$t('reload')"
            color="primary"
            v-close-popup
            @click="onReloadConfirmed"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import CampaignForm from 'src/components/admin/CampaignForm.vue';
import { notifyError } from 'src/utils/notify';

const authStore = useAuthStore();
const mapStore = useMapStore();
const adminStore = useAdminStore();

const selected = ref<number | null>(null);
const loading = ref(false);
const campaigns = computed(() => adminStore.campaigns || []);
const showReload = ref(false);

const hasChanges = computed(() => adminStore.hasChanges(mapStore.campaigns));

onMounted(() => {
   authStore.init().then(() => {
     if (!authStore.isAuthenticated) {
       return authStore.login();
     }
   }).then(onLoad);
})

function onLoad() {
  loading.value = true;
  mapStore.loadCampaigns().then(() => {
    adminStore.initCampaigns(mapStore.campaigns);
    if (campaigns.value.length > 0) {
      selected.value = 0;
    }
  }).finally(() => {
    loading.value = false;
  });
}

function onReload() {
  if (hasChanges.value) {
    showReload.value = true;
  } else {
    onLoad();
  }
}

function onReloadConfirmed() {
  onLoad();
  showReload.value = false;
}

function onAdd() {
  adminStore.addCampaign();
  selected.value = campaigns.value.length - 1;
}

function onDelete(index: number) {
  adminStore.addCampaignToDelete(index);
  selected.value = index === 0 ? 0 : index - 1;
}

function onSave() {
  loading.value = true;
  adminStore.saveCampaigns()
    .then(onLoad)
    .catch((error) => {
      notifyError(error);
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>