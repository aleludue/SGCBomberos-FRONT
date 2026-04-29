<template>
  <div class="form-floating">
    <input
      v-model="emailValue"
      type="text"
      class="form-control"
      autocomplete="off"
      placeholder=""
      @blur="emailBlur"
      :class="{ 'border-danger is-invalid': emailError }"
    />
    <label for="emailLog">{{ labelText }}</label>
    <span v-if="emailError" class="text-danger">{{ emailError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { watch } from 'vue';
import { string } from 'yup';

const { labelText = undefined, email = undefined } = defineProps(['labelText', 'email']);

const {
  value: emailValue,
  errorMessage: emailError,
  handleBlur: emailBlur,
  resetField: resetEmailField,
} = useField('email', string().required().email());

watch(
  () => email,
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
