<template>
  <q-toolbar>
    <q-btn
      v-if="!noMenu"
      flat
      dense
      round
      icon="menu"
      class="on-left"
      @click="toggleLeftDrawer"
    />
    <a href="https://epfl.ch" target="_blank" class="q-mt-sm">
      <img src="EPFL_logo.png" style="height: 25px" />
    </a>
    <span class="q-ml-md text-h6">{{ $t('app_title') }}</span>
    <q-space />
    <span v-if="!$q.screen.lt.md">
      <q-btn
        no-caps
        color="primary"
        class="on-left"
        :icon="mapStore.showGlobe ? 'map' : 'public'"
        :label="mapStore.showGlobe ? 'Show 2D' : 'Show 3D'"
        @click="toggleShowGlobe"
      ></q-btn>
      <q-btn
        flat
        round
        icon="settings"
        :title="$t('administration')"
        :to="'/admin'"
      ></q-btn>
      <q-btn
        flat
        round
        icon="menu_book"
        :title="$t('resources')"
        @click="showResources = true"
      ></q-btn>
      <q-btn
        flat
        round
        icon="info"
        :title="$t('introduction')"
        @click="showIntro = true"
      ></q-btn>
      <q-btn
        flat
        round
        :title="$t('profile')"
        icon="account_circle"
        class="on-left"
      >
        <q-popup-proxy>
          <q-list class="bg-white">
            <q-item clickable v-close-popup to="/profile">
              <q-item-section>
                <q-item-label v-if="authStore.isAuthenticated">{{ $t('profile') }}</q-item-label>
                <q-item-label v-else>{{ $t('user.login') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="authStore.isAuthenticated" clickable v-close-popup @click="authStore.logout">
              <q-item-section>
                <q-item-label>{{ $t('user.logout') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-popup-proxy>
      </q-btn>
    </span>
    <q-btn v-if="$q.screen.lt.md" flat round icon="more_vert">
      <q-popup-proxy>
        <q-list class="bg-white">
          <q-item clickable v-close-popup :to="'/admin'">
            <q-item-section>
              <q-item-label>{{ $t('administration') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="showResources = true">
            <q-item-section>
              <q-item-label>{{ $t('resources') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="showIntro = true">
            <q-item-section>
              <q-item-label>{{ $t('introduction') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup :to="'/profile'">
            <q-item-section>
              <q-item-label>{{ $t('profile') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-popup-proxy>
    </q-btn>
    <a href="https://www.epfl.ch/labs/eerl/" target="_blank" class="q-mt-xs">
      <span class="text-logo q-mb-xs">EERL</span>
    </a>
  </q-toolbar>

  <simple-dialog
    v-model="showIntro"
    :title="$t('app_title')"
    :content="IntroductionMd"
  />

  <simple-dialog v-model="showResources" :title="$t('resources')">
    <q-list separator>
      <essential-link
        v-for="link in essentialLinks"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </simple-dialog>
</template>

<script lang="ts">
export default defineComponent({
  components: { SimpleDialog },
  name: 'AppToolbar',
});
</script>
<script setup lang="ts">
import IntroductionMd from 'src/assets/introduction.md';
import essentialLinks from 'src/assets/links.json';
import EssentialLink from 'src/components/EssentialLink.vue';
import SimpleDialog from 'src/components/SimpleDialog.vue';
import { Settings } from 'src/stores/settings';

interface Props {
  noMenu?: boolean;
}

withDefaults(defineProps<Props>(), {
  noMenu: false,
});
const emit = defineEmits(['toggle']);

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const mapStore = useMapStore();
const authStore = useAuthStore();

const showIntro = ref(false);
const showResources = ref(false);

onMounted(() => {
  if (!settingsStore.settings?.intro_shown) {
    showIntro.value = true;
    settingsStore.saveSettings({ intro_shown: true } as Settings);
  }
  mapStore.showGlobe = settingsStore.settings?.show_globe ?? false;
});

function toggleLeftDrawer() {
  emit('toggle');
}

function toggleShowGlobe() {
  mapStore.showGlobe = !mapStore.showGlobe;
  settingsStore.saveSettings({ show_globe: mapStore.showGlobe } as Settings);
  if (route.path === '/admin') {
    router.push('/');
  }
}
</script>
