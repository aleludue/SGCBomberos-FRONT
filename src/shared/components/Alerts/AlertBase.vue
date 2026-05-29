<template>
  <div class="alert m-0 text-center p-2" :class="alertStyle" role="alert" v-bind="$attrs">
    {{ labelText }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    labelText?: string;
    alertStyle?: string;
  }>(),
  {
    labelText: '',
    alertStyle: 'alert-info',
  },
);
</script>
