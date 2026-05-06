<template>
  <div class="input-group">
    <div class="form-floating error-tooltip-wrapper">
      <input
        :id="uuid"
        v-model="passValue"
        v-bind="$attrs"
        :type="showPassword ? 'text' : 'password'"
        class="form-control"
        autocomplete="off"
        :placeholder="placeholdText"
        @blur="passBlur"
        :class="{ 'is-invalid': passError }"
      />
      <label :for="uuid">{{ labelText }}</label>
      <span v-if="passError" class="error-tooltip-msg"> {{ passError }}</span>
    </div>
    <span
      v-if="btnViewPass"
      role="button"
      class="input-group-text"
      @click="showPassword = !showPassword"
      :title="showPassword ? 'Ocultar' : 'Mostrar'"
    >
      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, ref, useId } from 'vue';
import { string } from 'yup';

defineOptions({ inheritAttrs: false });

const uuid = useId();
const showPassword = ref(false);

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'passwordField' },
  btnViewPass: { type: Boolean, default: false },
  minLength: { type: Number, default: 8 },
  placeholdText: { type: String, default: '' },
});

defineModel<string>('passVal');

const passSchema = computed(() => {
  return string().required().min(props.minLength);
});

const {
  value: passValue,
  errorMessage: passError,
  handleBlur: passBlur,
  resetField: resetPassField,
} = useField(props.fieldName, passSchema, {
  syncVModel: 'passVal',
});

defineExpose({
  resetPassField,
});
</script>
