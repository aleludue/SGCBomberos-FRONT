<template>
  <div :class="'col-md-6 col-lg-4 col-12 d-flex flex-wrap align-items-center'" v-if="valueText">
    <p :class="{ 'form-label': formStyle, 'm-0 me-2': !formStyle }">{{ labelText }}</p>

    <p
      class="text-truncate"
      :title="valueText"
      :class="{ 'form-control-plaintext': formStyle, 'm-0': !formStyle }"
    >
      <strong>{{ valueText }}</strong>
    </p>
  </div>
</template>

<script lang="ts" setup>
const {
  labelText = undefined,
  valueText = undefined,
  formStyle = false,
} = defineProps(['labelText', 'valueText', 'formStyle']);
</script>
