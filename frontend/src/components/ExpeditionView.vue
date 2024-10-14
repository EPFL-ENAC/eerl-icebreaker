<template>
  <div>
    <div class="text-help q-mb-md">{{ expedition.name }}</div>
    <q-markdown :src="expedition.objectives" />
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
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>{{ $t('dates') }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ expedition.start_date }} / {{ expedition.end_date }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>{{ $t('location') }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ expedition.location }}
              </q-item-label>
              <q-item-label class="text-help">
                {{ expedition.platform }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="expedition.track">
            <q-item-section>
              <q-item-label overline>{{ $t('track') }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <a :href="trackUrl" target="_blank" class="epfl">
                  {{ expedition.track.file }}
                  <q-icon name="download" />
                </a>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="references">
        <q-list separator>
          <q-item v-for="reference in expedition.references" :key="reference.doi">
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
          <q-item v-for="instrument in expedition.instruments" :key="instrument.name">
            <q-item-section>
              <q-item-label overline>{{ instrument.name }}</q-item-label>
              <q-item-label class="text-help">{{ instrument.description }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <div>
                <dl>
                  <template v-for="measure in instrument.measures" :key="measure.name">
                    <dd
                    class="q-ma-none text-caption text-bold">{{ measure.name }}</dd>
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
          <q-item v-for="funding in expedition.fundings" :key="funding">
            <q-item-section>
              <q-item-label overline>{{ funding }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>


<script lang="ts">
export default defineComponent({
  name: 'ExpeditionView',
});
</script>
<script setup lang="ts">
import { Expedition } from 'src/models';
import { cdnUrl } from 'src/boot/api';

interface Props {
  expedition: Expedition;
}
const props = defineProps<Props>();

const tab = ref('info');
const slide = ref(1);

const imageUrls = computed(() => {
  return props.expedition.images ? props.expedition.images.map((image) => `${cdnUrl}expeditions/${props.expedition.acronym}/${image}`) : [];
});

const trackUrl = computed(() => {
  return props.expedition.track ? `${cdnUrl}expeditions/${props.expedition.acronym}/${props.expedition.track.file}` : '';
});

function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}
</script>