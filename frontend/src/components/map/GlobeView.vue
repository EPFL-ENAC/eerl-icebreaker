<template>
  <div id="earth_div"
    class="bg-black"
    style="
      position: absolute;
      top: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      z-index: 0;
      overflow: hidden;
    ">

  </div>
</template>

<script setup lang="ts">

const mapStore = useMapStore();

onMounted(() => {
  mapStore.initialize('earth_div');
});

</script>