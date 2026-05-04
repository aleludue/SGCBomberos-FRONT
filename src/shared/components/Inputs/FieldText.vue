<template>
  <div :class="{ 'col-12 col-md-6 col-lg-4': !isLoginForm, 'form-floating': isLoginForm }">
    <label v-if="!isLoginForm" for="fieldTexts" class="form-label">
      {{ labelText }}
    </label>
    <input
      v-model="textValue"
      type="text"
      class="form-control"
      id="fieldTexts"
      @blur="textBlur"
      placeholder=""
      :class="{ 'border-danger is-invalid': textError }"
    />
    <label v-if="isLoginForm" class="form-label" for="fieldTexts">{{ labelText }}</label>
    <span v-if="textError" class="invalid-feedback">{{ textError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { string } from 'yup';

const { t } = useI18n();

const {
  labelText = undefined,
  textDet = undefined,
  fieldName = undefined,
  isRequired = false,
  maxLength = 0,
  minLength = 0,
  isLoginForm = false,
} = defineProps([
  'labelText',
  'textDet',
  'fieldName',
  'isRequired',
  'maxLength',
  'isLoginForm',
  'minLength',
]);

const validShema = computed(() => {
  let detSch = string();

  if (isRequired) detSch = detSch.required();

  if (maxLength > 0)
    detSch = detSch.max(maxLength, t('ValidationMsg.MaxLength').replace('{max}', maxLength));

  if (minLength > 0)
    detSch = detSch.min(minLength, t('ValidationMsg.MinLength').replace('{max}', minLength));

  return detSch;
});

const {
  value: textValue,
  errorMessage: textError,
  handleBlur: textBlur,
  resetField: resetTextField,
} = useField(fieldName || 'texField', validShema);

watch(
  () => textDet,
  (newVal) => {
    if (newVal) textValue.value = newVal;
  },
  { immediate: true },
);

defineExpose({
  resetTextField,
});
</script>
