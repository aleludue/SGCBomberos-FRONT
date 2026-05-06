<template>
  <div class="input-group">
    <div class="form-floating error-tooltip-wrapper">
      <input
        id="passInput"
        v-model="passValue"
        :type="showPassword ? 'text' : 'password'"
        class="form-control"
        autocomplete="off"
        placeholder=""
        @blur="passBlur"
        :class="{ 'is-invalid': passError }"
      />
      <label for="passInput">{{ labelText }}</label>
      <span v-if="passError" class="error-tooltip-msg"> {{ passError }}</span>
    </div>
    <span
      v-if="btnViewPass"
      role="button"
      class="input-group-text"
      @click="showPassword = !showPassword"
    >
      <i class="bi bi-eye"></i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref } from 'vue';
import { string } from 'yup';

const showPassword = ref(false);

const {
  labelText = undefined,
  btnViewPass = undefined,
  fieldName = undefined,
} = defineProps(['labelText', 'btnViewPass', 'fieldName']);

const {
  value: passValue,
  errorMessage: passError,
  handleBlur: passBlur,
  resetField: resetPassField,
} = useField(fieldName || 'pass', string().required().min(8));

defineExpose({
  resetPassField,
});
</script>
