<template>
  <div class="col-md-6 col-sm-12 col-xs-12">
    <label for="readOnlyInput" class="form-label">
      {{ props.labelText }}
    </label>
    <input readonly :value="props.value" type="text" class="form-control" id="readOnlyInput" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  labelText?: string;
  value?: string;
}>();
</script>
