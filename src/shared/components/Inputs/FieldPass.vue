<template>
  <div class="input-group">
    <div class="form-floating">
      <input
        id="passInput"
        v-model="passValue"
        :type="showPassword ? 'text' : 'password'"
        class="form-control"
        autocomplete="off"
        placeholder=""
        @blur="passBlur"
        :class="{ 'border-danger is-invalid': passError }"
      />
      <label for="passInput">{{ labelText }}</label>
    </div>
    <span
      v-if="btnViewPass"
      role="button"
      class="input-group-text"
      @click="showPassword = !showPassword"
    >
      <i class="bi bi-eye"></i>
    </span>
    <span v-if="passError" class="text-danger">{{ passError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref } from 'vue';
import { string } from 'yup';

const showPassword = ref(false);

const { labelText = undefined, btnViewPass = undefined } = defineProps([
  'labelText',
  'btnViewPass',
]);

const {
  value: passValue,
  errorMessage: passError,
  handleBlur: passBlur,
  resetField: resetPassField,
} = useField('pass', string().required().min(8));

defineExpose({
  resetPassField,
});
</script>
