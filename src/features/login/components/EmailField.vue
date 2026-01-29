<template>
  <div class="mb-2 form-floating">
    <input
      v-model="emailValue"
      type="text"
      class="form-control"
      autocomplete="off"
      placeholder=""
      @blur="emailBlur"
      :class="{ 'border-danger is-invalid': emailError }"
    />
    <label for="emailLog">{{ props.labelText }}</label>
    <span v-if="emailError" class="text-danger">{{ emailError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { watch } from 'vue';

const props = defineProps<{
  labelText?: string;
  email?: string;
}>();

const {
  value: emailValue,
  errorMessage: emailError,
  handleBlur: emailBlur,
  resetField: resetEmailField,
} = useField('email');

watch(
  () => props.email,
  (newVal) => {
    if (newVal) {
      emailValue.value = newVal;
    }
  },
  { immediate: true },
);

defineExpose({
  resetEmailField,
});
</script>
