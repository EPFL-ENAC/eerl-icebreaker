<template>
  <div>
    <div class="bg-white float-left"
      style="
      position: absolute;
      top: 0px;
      right: auto;
      bottom: auto;
      left: 0;
      z-index: 1000;">
      <q-list>
        <q-item>
          <q-btn
            flat
            no-caps
            color="primary"
            size="12px"
            icon="arrow_upward"
            :label="$t('fly_to_arctic')"
            @click="mapStore.panTo([90, 0])"
            align="left"
          />
        </q-item>
        <q-item>
          <q-btn
            flat
            no-caps
            color="primary"
            size="12px"
            icon="arrow_downward"
            :label="$t('fly_to_antarctic')"
            @click="mapStore.panTo([-90, 0])"
            align="left"
          />
        </q-item>
      </q-list>
    </div>
    <div id="globe" />
  </div>
</template>

<script setup lang="ts">

const mapStore = useMapStore();

onMounted(() => {
  mapStore.initialize('globe');
});

</script>