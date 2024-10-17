<template>
  <div>
    <pre>{{ campaign }}</pre>
  </div>
</template>


<script lang="ts">
export default defineComponent({
  name: 'CampaignForm',
});
</script>
<script setup lang="ts">
import { Campaign } from 'src/models';
import { cdnUrl } from 'src/boot/api';

interface Props {
  modelValue: Campaign;
}
const props = defineProps<Props>();

const campaign = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  campaign.value = val;
});
</script>