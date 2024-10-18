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
        <div v-if="campaigns.length === 0">
          <q-btn @click="onAdd" color="secondary" :label="$t('add')" icon="add"/>
        </div>
        <div v-else>
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
              <q-btn @click="onAdd" color="secondary" :label="$t('add')" icon="add" size="sm" class="full-width"/>
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
  </q-page>
</template>

<script setup lang="ts">
import CampaignForm from 'src/components/admin/CampaignForm.vue';

const authStore = useAuthStore();
const mapStore = useMapStore();

const selected = ref<number | null>(null);
const campaigns = computed(() => mapStore.campaigns || []);

onMounted(() => {
   authStore.init().then(() => {
     if (!authStore.isAuthenticated) {
       return authStore.login();
     }
   }).then(() => {
      mapStore.loadCampaigns().then(() => {
        if (campaigns.value.length > 0) {
          selected.value = 0;
        }
      });
   });
   
})

function onAdd() {
  mapStore.addCampaign();
  selected.value = campaigns.value.length - 1;
}

function onDelete(index: number) {
  mapStore.deleteCampaign(index);
  selected.value = index === 0 ? 0 : index - 1;
}
</script>