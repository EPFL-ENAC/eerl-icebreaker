<template>
  <div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-3">
        <q-input
          v-model="campaign.acronym"
          :label="t('acronym')"
          filled
        />
      </div>
      <div class="col">
        <q-input
          v-model="campaign.name"
          :label="t('name')"
          filled
        />
      </div>
      <div class="col">
        <q-input
          v-model="campaign.website"
          :label="t('website')"
          filled
        />
      </div>
    </div>
    <div class="q-mb-md">
      <q-input
        v-model="campaign.objectives"
        :label="t('summary')"
        filled
        type="textarea"
      />
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col">
        <q-input
          v-model="campaign.location"
          :label="t('location')"
          filled
        />
      </div>
      <div class="col">
        <q-input
          v-model="campaign.platform"
          :label="t('platform')"
          filled
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col">
        <q-input
          v-model="campaign.start_date"
          :label="t('start_date')"
          filled >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="campaign.start_date" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-input
          v-model.number="start_location_lat"
          :label="t('start_location_lat')"
          filled
          type="number"
          @update:model-value="onStartLocationLatUpdate"
        />
      </div>
      <div class="col">
        <q-input
          v-model.number="start_location_lon"
          :label="t('start_location_lon')"
          filled
          type="number"
          @update:model-value="onStartLocationLonUpdate"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col">
        <q-input
          v-model="campaign.end_date"
          :label="t('end_date')"
          filled >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="campaign.end_date" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-input
          v-model.number="end_location_lat"
          :label="t('end_location_lat')"
          filled
          type="number"
          @update:model-value="onEndLocationLatUpdate"
        />
      </div>
      <div class="col">
        <q-input
          v-model.number="end_location_lon"
          :label="t('end_location_lon')"
          filled
          type="number"
          @update:model-value="onEndLocationLonUpdate"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col">
        <q-input
          filled
          :label="t('color')"
          :hint="t('color_hint')"
          v-model="campaign.color"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="campaign.color" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-input
          v-model="campaign.offsetX"
          :label="t('offset_x')"
            :hint="t('offset_x_hint')"
          filled
          type="number"
          @update:model-value="onOffsetUpdate"
        />
      </div>
      <div class="col">
        <q-input
          v-model="campaign.offsetY"
          :label="t('offset_y')"
            :hint="t('offset_y_hint')"
          filled
          type="number"
          @update:model-value="onOffsetUpdate"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-lg-6">
        <div class="text-h6 q-mb-md">{{ t('images') }}</div>
        <q-list bordered separator v-if="campaign.images && campaign.images.length" class="q-mb-md">
          <template v-for="image in campaign.images" :key="image.path">
            <q-item>
              <q-item-section>
                <a :href="`${cdnUrl}/${image.alt_path ? image.alt_path : image.path}`" target="_blank" class="epfl">
                  {{ image.alt_name ? image.alt_name : image.name }}
                  <q-icon name="visibility" />
                </a>
              </q-item-section>
              <q-item-section avatar>
                <q-img :src="`${cdnUrl}/${image.path}`" width="200px" fit="scale-down" />
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  icon="delete"
                  rounded
                  dense
                  flat
                  color="negative"
                  size="12px"
                  @click="onDeleteImage(image)"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
        <q-file
          filled
          v-model="localFile"
          :label="t('add_image_file')"
          :hint="t('upload_file_hint')"
          accept=".jpg, .jpeg, .png, .webp"
          :disable="uploading"
          @update:model-value="onImageFileSelected"
        />
      </div>
      <div class="col-12 col-lg-6">
        <div class="text-h6 q-mb-md">{{ t('track') }}</div>
        <div v-if="campaign.track?.file">
          <q-list bordered class="q-mb-md">
            <q-item>
              <q-item-section>
                <a :href="`${cdnUrl}/${campaign.track.file.path}`" target="_blank" class="epfl">
                  {{ campaign.track.file.name }}
                  <q-icon name="download" />
                </a>
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  icon="delete"
                  rounded
                  dense
                  flat
                  color="negative"
                  size="12px"
                  @click="onDeleteTrack"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div class="text-bold">{{ t('columns') }}</div>
          <div class="text-help q-mb-md">{{ t('track_columns_info') }}</div>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col">
              <q-input
                v-model="campaign.track.columns.latitude"
                :label="t('latitude_col_name')"
                filled
              />    
            </div>
            <div class="col">
              <q-input
                v-model="campaign.track.columns.longitude"
                :label="t('longitude_col_name')"
                filled
              />  
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col">
              <q-input
                v-model="campaign.track.columns.timestamp"
                :label="t('timestamp_col_name')"
                filled
              />
            </div>
            <div class="col">
              <q-input
                :disable="!campaign.track.columns.timestamp"
                v-model="campaign.track.timestamp_format"
                :label="t('timestamp_format')"
                filled
              />
            </div>
          </div>
          <q-input
            filled
            :label="t('color')"
            :hint="t('track_color_hint')"
            v-model="campaign.track.color"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="campaign.track.color" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-file
          v-else
          filled
          v-model="localFile"
          :label="t('add_track_file')"
          :hint="t('upload_file_hint')"
          accept=".csv, .tsv"
          :disable="uploading"
          @update:model-value="onTrackFileSelected"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-lg-6">
        <div class="text-h6 q-mb-md">{{ t('funding') }}</div>
        <q-list bordered separator v-if="campaign.fundings && campaign.fundings.length" class="q-mb-md">
          <q-item v-for="(funding, i) in campaign.fundings" :key="funding.name">
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
            <q-item-section avatar>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <q-btn
                        :disable="i === 0"
                        icon="arrow_upward"
                        rounded
                        dense
                        flat
                        color="grey-8"
                        size="sm"
                        @click="onFundingUp(funding)"
                      />
                    </td>
                    <td>
                      <q-btn
                        :disable="i === campaign.fundings.length - 1"
                        icon="arrow_downward"
                        rounded
                        dense
                        flat
                        color="grey-8"
                        size="sm"
                        @click="onFundingDown(funding)"
                      />
                    </td>
                    <td>
                      <q-btn
                        icon="edit"
                        rounded
                        dense
                        flat
                        color="grey-8"
                        size="sm"
                        @click="onShowFunding(funding)"
                      />
                    </td>
                    <td>
                      <q-btn
                        icon="delete"
                        rounded
                        dense
                        flat
                        color="negative"
                        size="sm"
                        @click="onDeleteFunding(funding)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn
          color="primary"
          icon="add"
          size="sm"
          @click="onShowFunding(undefined)"
        />
      </div>
      <div class="col-12 col-lg-6">
        <div class="text-h6 q-mb-md">{{ t('references') }}</div>
        <q-list bordered separator v-if="campaign.references && campaign.references.length" class="q-mb-md">
          <q-item v-for="(reference, i) in campaign.references" :key="reference.doi">
            <q-item-section>
              <q-item-label overline>{{ reference.citation }}</q-item-label>
              <q-item-label class="text-help">{{ reference.title }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <a :href="`https://doi.org/${reference.doi}`" target="_blank" class="epfl">
                {{ reference.doi }}
                <q-icon name="open_in_new" />
              </a>
            </q-item-section>
            <q-item-section avatar>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <q-btn
                        :disable="i === 0"
                        icon="arrow_upward"
                        rounded
                        dense
                        flat
                        color="grey-8"
                        size="sm"
                        @click="onReferenceUp(reference)"
                      />
                    </td>
                    <td>
                      <q-btn
                        :disable="i === campaign.references.length - 1"
                        icon="arrow_downward"
                        rounded
                        dense
                        flat
                        color="grey-8"
                        size="sm"
                        @click="onReferenceDown(reference)"
                      />
                    </td>
                    <td>
                      <q-btn
                        icon="edit"
                        rounded
                        dense
                        flat
                        color="grey-8"
                        size="sm"
                        @click="onShowReference(reference)"
                      />
                    </td>
                    <td>
                      <q-btn
                        icon="delete"
                        rounded
                        dense
                        flat
                        color="negative"
                        size="sm"
                        @click="onDeleteReference(reference)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn
          color="primary"
          icon="add"
          size="sm"
          @click="onShowReference(undefined)"
        />
      </div>
    </div>
    <div class="text-h6 q-mb-md">{{ t('instrument_measures') }}</div>
    <q-list bordered separator v-if="campaign.instruments && campaign.instruments.length" class="q-mb-md">
      <q-item v-for="(instrument, i) in campaign.instruments" :key="instrument.name">
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
        <q-item-section avatar>
          <table>
            <tbody>
              <tr>
                <td>
                  <q-btn
                    :disable="i === 0"
                    icon="arrow_upward"
                    rounded
                    dense
                    flat
                    color="grey-8"
                    size="sm"
                    @click="onInstrumentUp(instrument)"
                  />
                </td>
                <td>
                  <q-btn
                    :disable="i === campaign.instruments.length - 1"
                    icon="arrow_downward"
                    rounded
                    dense
                    flat
                    color="grey-8"
                    size="sm"
                    @click="onInstrumentDown(instrument)"
                  />
                </td>
                <td>
                  <q-btn
                    icon="edit"
                    rounded
                    dense
                    flat
                    color="grey-8"
                    size="sm"
                    @click="onShowInstrument(instrument)"
                  />
                </td>
                <td>
                  <q-btn
                    icon="delete"
                    rounded
                    dense
                    flat
                    color="negative"
                    size="sm"
                    @click="onDeleteInstrument(instrument)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn
      color="primary"
      icon="add"
      size="sm"
      @click="onShowInstrument(undefined)"
    />

    <q-dialog v-model="showFundingDialog">
      <q-card style="width: 500px; max-width: 90hw;">
        <q-card-section>
          <q-input
            v-model="editedFunding.name"
            :label="t('name')"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="editedFunding.grant"
            :label="t('grant_number')"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="editedFunding.website"
            :label="t('website')"
            filled
            class="q-mb-md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="t('cancel')"
            color="secondary"
            v-close-popup
          />
          <q-btn
            :disable="!editedFunding.name"
            :label="t('apply')"
            color="primary"
            v-close-popup
            @click="onApplyFunding"
          />
        </q-card-actions>
        </q-card>
    </q-dialog>

    <q-dialog v-model="showReferenceDialog">
      <q-card style="width: 500px; max-width: 90hw;">
        <q-card-section>
          <q-input
            v-model="editedReference.citation"
            :label="t('citation')"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="editedReference.title"
            :label="t('title')"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="editedReference.doi"
            :label="t('doi')"
            filled
            class="q-mb-md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="t('cancel')"
            color="secondary"
            v-close-popup
          />
          <q-btn
            :disable="!editedReference.citation || !editedReference.doi"
            :label="t('apply')"
            color="primary"
            v-close-popup
            @click="onApplyReference"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showInstrument">
      <q-card style="width: 800px; max-width: 90hw;">
        <q-card-section>
          <q-input
            v-model="editedInstrument.name"
            :label="t('name')"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="editedInstrument.description"
            :label="t('description')"
            filled
            autogrow
            type="textarea"
            class="q-mb-md"
          />
          <div class="text-bold q-mb-md">{{ t('measures') }}</div>
          <q-list bordered separator v-if="editedInstrument.measures && editedInstrument.measures.length" class="q-mb-md">
            <q-item v-for="(measure, i) in editedInstrument.measures" :key="i">
              <q-item-section>
                <q-input
                  v-model="measure.name"
                  :label="t('name')"
                  filled
                  class="q-mb-md"
                />
                <q-input
                  v-model="measure.description"
                  :label="t('description')"
                  filled
                  autogrow
                  type="textarea"
                  class="q-mb-md"
                />
                <div class="text-bold q-mb-md">{{ t('published_datasets') }}</div>
                <div v-for="(dataset, j) in measure.datasets" :key="j" class="q-mb-sm">
                  <table class="full-width">
                    <tr>
                      <td>
                        <q-input
                          v-model="measure.datasets[j]"
                          filled
                        />
                      </td>
                      <td>
                        <q-btn
                          color="secondary"
                          icon="delete"
                          dense
                          flat
                          size="sm"
                          class="q-ml-sm"
                          @click="measure.datasets.splice(j, 1)" />
                      </td>
                    </tr>
                  </table>
                </div>
                <div>
                  <q-btn
                    color="secondary"
                    icon="add"
                    dense
                    size="sm"
                    @click="measure.datasets.push('')"
                    class="q-mb-sm"
                  />
                </div>
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  icon="delete"
                  rounded
                  dense
                  flat
                  color="negative"
                  size="sm"
                  @click="editedInstrument.measures.splice(i, 1)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <q-btn
            color="primary"
            icon="add"
            size="sm"
            @click="editedInstrument.measures.push({ name: '', description: '', datasets: [] })"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="t('cancel')"
            color="secondary"
            v-close-popup
          />
          <q-btn
            :disable="!editedInstrument.name"
            :label="t('apply')"
            color="primary"
            v-close-popup
            @click="onApplyInstrument"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script lang="ts">
export default defineComponent({
  name: 'CampaignForm',
});
</script>
<script setup lang="ts">
import { Campaign, Funding, Reference, Instrument, FileRef } from 'src/models';
import { cdnUrl } from 'src/boot/api';
import { FileObject } from 'src/components/models';

const { t } = useI18n();

interface Props {
  modelValue: Campaign;
}
const props = defineProps<Props>();

const adminStore = useAdminStore();

const campaign = ref(props.modelValue);
const start_location_lat = ref(props.modelValue.start_location ? props.modelValue.start_location[0] : undefined);
const start_location_lon = ref(props.modelValue.start_location ? props.modelValue.start_location[1] : undefined);
const end_location_lat = ref(props.modelValue.end_location ? props.modelValue.end_location[0] : undefined);
const end_location_lon = ref(props.modelValue.end_location ? props.modelValue.end_location[1] : undefined);
const localFile = ref<FileObject>();
const showFundingDialog = ref(false);
const uploading = ref(false);
const selectedFunding = ref<Funding | undefined>();
const editedFunding = ref<Funding | undefined>();
const showReferenceDialog = ref(false);
const selectedReference = ref<Reference | undefined>();
const editedReference = ref<Reference | undefined>();
const showInstrument = ref(false);
const selectedInstrument = ref<Instrument | undefined>();
const editedInstrument = ref<Instrument | undefined>();

watch(() => props.modelValue, (val) => {
  campaign.value = val;
  start_location_lat.value = val.start_location ? val.start_location[0] : undefined;
  start_location_lon.value = val.start_location ? val.start_location[1] : undefined;
  end_location_lat.value = val.end_location ? val.end_location[0] : undefined;
  end_location_lon.value = val.end_location ? val.end_location[1] : undefined;
});

function onStartLocationLatUpdate() {
  if (!campaign.value.start_location) {
    campaign.value.start_location = [];
  }
  campaign.value.start_location[0] = start_location_lat.value || undefined;
}

function onStartLocationLonUpdate() {
  if (!campaign.value.start_location) {
    campaign.value.start_location = [];
  }
  campaign.value.start_location[1] = start_location_lon.value || undefined;
}

function onEndLocationLatUpdate() {
  if (!campaign.value.end_location) {
    campaign.value.end_location = [];
  }
  campaign.value.end_location[0] = end_location_lat.value || undefined;
}

function onEndLocationLonUpdate() {
  if (!campaign.value.end_location) {
    campaign.value.end_location = [];
  }
  campaign.value.end_location[1] = end_location_lon.value || undefined;
}

function onOffsetUpdate() {
  if (campaign.value.offsetX === '') {
    campaign.value.offsetX = undefined;
  }
  if (campaign.value.offsetY === '') {
    campaign.value.offsetY = undefined;
  }
}

function onImageFileSelected() {
  if (!localFile.value) {
    return;
  }
  uploading.value = true;
  adminStore.uploadTmpFile(localFile.value).then((image) => {
    if (!campaign.value.images) {
      campaign.value.images = [];
    }
    campaign.value.images.push(image);
    localFile.value = undefined;
  }).finally(() => {
    uploading.value = false;
  });
}

function onDeleteImage(image: FileRef) {
  // TODO delete image from server
  adminStore.addFileToDelete(image);
  campaign.value.images = campaign.value.images.filter((i) => i.path !== image.path);
}

function onTrackFileSelected() {
  if (!localFile.value) {
    return;
  }
  uploading.value = true;
  adminStore.uploadTmpFile(localFile.value).then((file) => {
    if (!campaign.value.track) {
      campaign.value.track = {
        file: file,
        columns: {
          latitude: 'latitude',
          longitude: 'longitude',
          timestamp: 'timestamp',
        },
        timestamp_format: 'yyyy-MM-dd HH:mm',
        color: undefined,

      };
    } else {
      campaign.value.track.file = file;
    }
    localFile.value = undefined;
  }).finally(() => {
    uploading.value = false;
  });
}

function onDeleteTrack() {
  if (!campaign.value.track?.file) return;
  adminStore.addFileToDelete(campaign.value.track.file);
  campaign.value.track = undefined;
}

function truncateString(str: string, num: number) {
  let newstr = str.replace('https://', '');
  if (newstr.length <= num) {
    return newstr;
  }
  return newstr.slice(0, num) + '...';
}

function onShowFunding(funding: Funding | undefined) {
  showFundingDialog.value = true;
  selectedFunding.value = funding;
  editedFunding.value = funding ? { ...funding} : {
    name: '',
    grant: '',
    website: '',
  };
}

function onApplyFunding() {
  if (!campaign.value.fundings) {
    campaign.value.fundings = [];
  }
  if (selectedFunding.value) {
    const index = campaign.value.fundings.indexOf(selectedFunding.value);
    campaign.value.fundings[index] = editedFunding.value;
  } else {
    campaign.value.fundings.push(editedFunding.value);
  }
  showFundingDialog.value = false;
}

function onDeleteFunding(funding: Funding) {
  campaign.value.fundings = campaign.value.fundings.filter((f) => f !== funding);
}

function onFundingUp(funding: Funding) {
  const index = campaign.value.fundings.indexOf(funding);
  if (index > 0) {
    const tmp = campaign.value.fundings[index - 1];
    campaign.value.fundings[index - 1] = funding;
    campaign.value.fundings[index] = tmp;
  }
}

function onFundingDown(funding: Funding) {
  const index = campaign.value.fundings.indexOf(funding);
  if (index < campaign.value.fundings.length - 1) {
    const tmp = campaign.value.fundings[index + 1];
    campaign.value.fundings[index + 1] = funding;
    campaign.value.fundings[index] = tmp;
  }
}

function onShowReference(reference: Reference) {
  showReferenceDialog.value = true;
  selectedReference.value = reference;
  editedReference.value = reference ? { ...reference } : {
    citation: '',
    title: '',
    doi: '',
  };
}

function onApplyReference() {
  if (!campaign.value.references) {
    campaign.value.references = [];
  }
  if (selectedReference.value) {
    const index = campaign.value.references.indexOf(selectedReference.value);
    campaign.value.references[index] = editedReference.value;
  } else {
    campaign.value.references.push(editedReference.value);
  }
  showReferenceDialog.value = false;
}

function onDeleteReference(reference: Reference) {
  campaign.value.references = campaign.value.references.filter((r) => r !== reference);
}

function onReferenceUp(reference: Reference) {
  const index = campaign.value.references.indexOf(reference);
  if (index > 0) {
    const tmp = campaign.value.references[index - 1];
    campaign.value.references[index - 1] = reference;
    campaign.value.references[index] = tmp;
  }
}

function onReferenceDown(reference: Reference) {
  const index = campaign.value.references.indexOf(reference);
  if (index < campaign.value.references.length - 1) {
    const tmp = campaign.value.references[index + 1];
    campaign.value.references[index + 1] = reference;
    campaign.value.references[index] = tmp;
  }
}

function onShowInstrument(instrument: Instrument | undefined) {
  showInstrument.value = true;
  selectedInstrument.value = instrument;
  // deep copy
  editedInstrument.value = instrument ? JSON.parse(JSON.stringify(instrument)) : {
    name: '',
    description: '',
    measures: [],
  };
}

function onApplyInstrument() {
  if (!campaign.value.instruments) {
    campaign.value.instruments = [];
  }
  if (selectedInstrument.value) {
    const index = campaign.value.instruments.indexOf(selectedInstrument.value);
    campaign.value.instruments[index] = editedInstrument.value;
  } else {
    campaign.value.instruments.push(editedInstrument.value);
  }
  showInstrument.value = false;
}

function onDeleteInstrument(instrument: Instrument) {
  campaign.value.instruments = campaign.value.instruments.filter((i) => i !== instrument);
}

function onInstrumentUp(instrument: Instrument) {
  const index = campaign.value.instruments.indexOf(instrument);
  if (index > 0) {
    const tmp = campaign.value.instruments[index - 1];
    campaign.value.instruments[index - 1] = instrument;
    campaign.value.instruments[index] = tmp;
  }
}

function onInstrumentDown(instrument: Instrument) {
  const index = campaign.value.instruments.indexOf(instrument);
  if (index < campaign.value.instruments.length - 1) {
    const tmp = campaign.value.instruments[index + 1];
    campaign.value.instruments[index + 1] = instrument;
    campaign.value.instruments[index] = tmp;
  }
}
</script>