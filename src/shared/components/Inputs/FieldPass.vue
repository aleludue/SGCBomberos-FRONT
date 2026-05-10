<template>
  <div class="input-group">
    <div class="form-floating error-tooltip-wrapper">
      <input
        :id="uuid"
        v-model="passValue"
        v-bind="$attrs"
        :type="showPassword ? 'text' : 'password'"
        class="form-control"
        :class="{ 'is-invalid': passError }"
        autocomplete="off"
        :placeholder="placeholdText"
        @blur="passBlur"
        :aria-invalid="!!passError"
      />
      <label :for="uuid">{{ labelText }}</label>
      <span v-if="passError" class="error-tooltip-msg" role="alert"> {{ passError }}</span>
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
import { computed, ref, useId, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { string } from 'yup';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'passwordField' },
  btnViewPass: { type: Boolean, default: false },
  minLength: { type: Number, default: 8 },
  placeholdText: { type: String, default: '' },
  isConfirmField: { type: Boolean, default: false },
});

const { t } = useI18n();
const uuid = useId();
const showPassword = ref(false);

defineModel<string>('passVal');
const originPass = defineModel<string>('originPass');

const passSchema = computed(() => {
  let schema = string().required().min(props.minLength);

  if (props.isConfirmField) {
    return schema.test(
      'match-pass',
      t('ValidationMsg.PasswordMismatch'),
      (value) => value === originPass.value,
    );
  }

  return schema;
});

const {
  value: passValue,
  errorMessage: passError,
  handleBlur: passBlur,
  validate: validateField,
  resetField: resetPassField,
} = useField(props.fieldName, passSchema, {
  syncVModel: 'passVal',
});

if (props.isConfirmField) {
  watch(
    () => originPass.value,
    () => {
      if (passValue.value) validateField();
    },
  );
}

defineExpose({
  resetPassField,
});
</script>
