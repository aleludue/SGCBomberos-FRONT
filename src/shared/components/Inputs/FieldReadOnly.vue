<template>
  <div
    v-if="valueText"
    :class="'col-md-6 col-lg-4 col-12 d-flex flex-wrap align-items-center'"
    v-bind="$attrs"
  >
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
defineOptions({ inheritAttrs: false });

defineProps({
  labelText: { type: String, default: '' },
  valueText: { type: String, default: '' },
  formStyle: { type: Boolean, default: false },
});
</script>
