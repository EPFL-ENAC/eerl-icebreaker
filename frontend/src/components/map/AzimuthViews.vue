<template>
  <div>
    <div class="bg-white float-left"
      style="
      position: absolute;
      top: 15px;
      right: auto;
      bottom: auto;
      left: 8px;
      z-index: 1000;">
      <q-btn
        flat
        no-caps
        square
        color="primary"
        :class="split === 100 ? 'bg-red-2' : ''"
        size="12px"
        icon="north"
        :label="$t('fly_to_arctic')"
        @click="split === 100 ? split = 50 : split = 100"
        align="left"
      />
      <q-btn
        flat
        no-caps
        square
        color="primary"
        :class="split === 0 ? 'bg-red-2' : ''"
        size="12px"
        icon="south"
        :label="$t('fly_to_antarctic')"
        @click="split === 0 ? split = 50 : split = 0"
        align="left"
      />
    </div>
    <q-splitter
      v-model="split"
      :limits="[0, 100]"
    >
      <template v-slot:before>
        <azimuth-view id="north" projection="EPSG:3995" :embed="isEmbeded" />
      </template>

      <template v-slot:separator>
        <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
      </template>
      <template v-slot:after>
        <azimuth-view id="south" projection="EPSG:3031" :embed="isEmbeded" />
      </template>
    </q-splitter>
  </div>
</template>


<script lang="ts">
export default defineComponent({
  name: 'AzimuthViews',
});
</script>
<script setup lang="ts">
import AzimuthView from 'src/components/map/AzimuthView.vue';

const route = useRoute();

const split = ref(50);
const isEmbeded = computed(() => route.query.embed !== undefined && route.query.embed !== 'false' && route.query.embed !== '0');

</script>