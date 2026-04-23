<template>
  <div class="col-md-4 col-sm-12 col-xs-12 d-flex flex-wrap align-items-center" v-if="props.value">
    <p class="m-0 me-2">{{ props.labelText }}</p>

    <p class="m-0">
      <strong>{{ props.value }}</strong>
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  labelText?: string;
  value?: string;
}>();
</script>
