<template>
  <div
    class="error-tooltip-wrapper"
    :class="{ 'col-12 col-md-6 col-lg-4': !isLoginForm, 'form-floating': isLoginForm }"
  >
    <label v-if="!isLoginForm" for="numbInput" class="form-label">
      {{ labelText }}
    </label>
    <input
      v-model="numValue"
      type="number"
      class="form-control"
      id="numbInput"
      @blur="numBlur"
      placeholder=""
      :class="{ 'is-invalid': numError }"
    />
    <label v-if="isLoginForm" class="form-label" for="numbInput">{{ labelText }}</label>
    <span v-if="numError" class="error-tooltip-msg"> {{ numError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { number } from 'yup';

const { t } = useI18n();

const {
  labelText = undefined,
  numVal = undefined,
  fieldName = undefined,
  isRequired = false,
  isLoginForm = false,
} = defineProps(['labelText', 'numVal', 'fieldName', 'isRequired', 'isLoginForm']);

const validShema = computed(() => {
  let detSch = number().typeError(t('ValidationMsg.NumType'));

  if (isRequired) detSch = detSch.required().moreThan(0);

  return detSch;
});

const {
  value: numValue,
  errorMessage: numError,
  handleBlur: numBlur,
} = useField(fieldName || 'numInput', validShema);

watch(
  () => numVal,
  (newVal) => {
    if (newVal) numValue.value = newVal;
  },
  { immediate: true },
);
</script>
