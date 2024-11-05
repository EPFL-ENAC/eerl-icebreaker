<template>
  <q-layout view="hHh lpR fFf">
    <q-header v-if="!isEmbeded" bordered class="bg-white text-grey-10">
      <app-toolbar no-menu />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppToolbar from 'src/components/AppToolbar.vue';

const route = useRoute();

const isEmbeded = computed(() => route.query.embed !== undefined && route.query.embed !== 'false' && route.query.embed !== '0');

</script>
