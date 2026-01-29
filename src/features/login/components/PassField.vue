<template>
  <div class="mb-2 input-group">
    <div class="form-floating">
      <input
        v-model="passValue"
        :type="showPassword ? 'text' : 'password'"
        class="form-control"
        autocomplete="off"
        placeholder=""
        @blur="passBlur"
        :class="{ 'border-danger is-invalid': passError }"
      />
      <label for="passLog">{{ props.labelText }}</label>
    </div>
    <span
      v-if="props.btnViewPass"
      role="button"
      class="input-group-text"
      @click="showPassword = !showPassword"
    >
      <i class="bi bi-eye"></i>
    </span>
  </div>
  <span v-if="passError" class="text-danger">{{ passError }}</span>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref } from 'vue';

const showPassword = ref(false);

const props = defineProps<{
  labelText?: string;
  btnViewPass?: boolean;
}>();

const {
  value: passValue,
  errorMessage: passError,
  handleBlur: passBlur,
  resetField: resetPassField,
} = useField('pass');

defineExpose({
  resetPassField,
});
</script>
