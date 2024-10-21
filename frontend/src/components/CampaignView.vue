<template>
  <div>
    <div class="text-help q-mb-md">{{ campaign.name }}</div>
    <q-markdown :src="campaign.objectives" />
    <q-tabs v-model="tab"
      dense
      class="text-grey q-mt-md"
      active-color="secondary"
      active-bg-color="light-blue-1"
      indicator-color="secondary"
      align="justify">
      <q-tab name="info" :label="$t('info')" />
      <q-tab name="references" :label="$t('references')" />
      <q-tab name="instruments" :label="$t('instrument_measures')" />
      <q-tab name="fundings" :label="$t('fundings')" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="info">
        <div v-if="imageUrls.length > 1">
          <q-carousel
            animated
            v-model="slide"
            arrows
            navigation
            infinite
          >
            <template v-for="(imageUrl, index) in imageUrls" :key="imageUrl">
              <q-carousel-slide :name="index + 1" :img-src="imageUrl" />
            </template>
          </q-carousel>
        </div>
        <div v-else-if="imageUrls.length === 1">
          <q-img
            :src="imageUrls[0]"
            :alt="campaign.name"
            spinner-color="grey-6"
            class="q-mb-md"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </div>
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>{{ $t('dates') }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ campaign.start_date }} / {{ campaign.end_date }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>{{ $t('location') }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ campaign.location }}
              </q-item-label>
              <q-item-label class="text-help">
                {{ campaign.platform }}
              </q-item-label>
              <q-item-label v-if="hasStartLocation" class="text-grey-8">
                <q-icon name="location_on" color="grey-10"/>
                {{ formatCoordinates(campaign.start_location[0], campaign.start_location[1]) }} 
                <span v-if="hasEndLocation">
                  <q-icon name="east" color="grey-10"/>
                  {{ formatCoordinates(campaign.end_location[0], campaign.end_location[1]) }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="campaign.track">
            <q-item-section>
              <q-item-label overline>{{ $t('track') }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <a :href="trackUrl" target="_blank" class="epfl">
                  {{ campaign.track.file.name }}
                  <q-icon name="download" />
                </a>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="references">
        <q-list separator>
          <q-item v-for="reference in campaign.references" :key="reference.doi">
            <q-item-section>
              <q-item-label overline>{{ reference.citation }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <a :href="`https://doi.org/${reference.doi}`" target="_blank" class="epfl">
                {{ reference.doi }}
                <q-icon name="open_in_new" />
              </a>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="instruments">
        <q-list separator>
          <q-item v-for="instrument in campaign.instruments" :key="instrument.name">
            <q-item-section>
              <q-item-label overline>{{ instrument.name }}</q-item-label>
              <q-item-label class="text-help">{{ instrument.description }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <div>
                <dl>
                  <template v-for="measure in instrument.measures" :key="measure.name">
                    <dd class="q-ma-none">
                      <div class="text-caption text-bold">{{ measure.name }}</div>
                      <div v-if="measure.description" class="text-hint">{{ measure.description }}</div>
                    </dd>
                    <dt
                      v-for="link in measure.datasets"
                      :key="link"
                      class="q-mt-xs q-mb-xs"
                      style="font-size: smaller;"
                    >
                      <a :href="link" target="_blank" class="epfl">
                        {{ truncateString(link, 100) }}
                        <q-icon name="open_in_new" />
                      </a>
                    </dt>
                  </template>
                </dl>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="fundings">
        <q-list separator>
          <q-item v-for="funding in campaign.fundings" :key="funding.name">
            <q-item-section>
              <q-item-label overline>{{ funding.name }}</q-item-label>
              <q-item-label v-if="funding.grant" class="text-help">{{ funding.grant }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="funding.website">
              <a :href="funding.website" target="_blank" class="epfl">
                {{ truncateString(funding.website, 40) }}
                <q-icon name="open_in_new" />
              </a>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>


<script lang="ts">
export default defineComponent({
  name: 'CampaignView',
});
</script>
<script setup lang="ts">
import { Campaign } from 'src/models';
import { cdnUrl } from 'src/boot/api';
import { formatCoordinates } from 'src/utils/numbers';

interface Props {
  campaign: Campaign;
}
const props = defineProps<Props>();

const tab = ref('info');
const slide = ref(1);

const imageUrls = computed(() => {
  return props.campaign.images ? props.campaign.images.map((image) => `${cdnUrl}/${image.path}`) : [];
});

const trackUrl = computed(() => {
  return props.campaign.track ? `${cdnUrl}/${props.campaign.track.file.path}` : '';
});

const hasStartLocation = computed(() => {
  return props.campaign.start_location && props.campaign.start_location.length == 2;
});

const hasEndLocation = computed(() => {
  return props.campaign.end_location && props.campaign.end_location.length == 2;
});

function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}
</script>