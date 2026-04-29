<template>
  <div :class="mdSize + ' col-sm-12 col-xs-12 ' + flexProps" v-if="valueText">
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
  mdSize = 'col-md-4',
  flexProps = 'd-flex flex-wrap align-items-center',
  formStyle = false,
} = defineProps(['labelText', 'valueText', 'mdSize', 'flexProps', 'formStyle']);
</script>
