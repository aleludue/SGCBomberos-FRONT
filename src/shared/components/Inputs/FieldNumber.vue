<template>
  <div
    class="error-tooltip-wrapper"
    :class="{ 'col-12 col-md-6 col-lg-4': !isLoginForm, 'form-floating': isLoginForm }"
  >
    <label v-if="!isLoginForm" :for="uuid" class="form-label">
      {{ labelText }}
    </label>
    <input
      :id="uuid"
      v-model="numValue"
      v-bind="$attrs"
      type="number"
      class="form-control"
      @blur="numBlur"
      :placeholder="placeholdText"
      :class="{ 'is-invalid': numError }"
    />
    <label v-if="isLoginForm" class="form-label" :for="uuid">{{ labelText }}</label>
    <span v-if="numError" class="error-tooltip-msg" role="alert"> {{ numError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { number } from 'yup';

defineOptions({ inheritAttrs: false });

const { t } = useI18n();
const uuid = useId();

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'numField' },
  isRequired: { type: Boolean, default: false },
  isLoginForm: { type: Boolean, default: false },
  placeholdText: { type: String, default: '' },
});

defineModel<number | null>('numVal');

const validShema = computed(() => {
  let detSch = number().typeError(t('ValidationMsg.NumType'));

  if (props.isRequired) detSch = detSch.required().moreThan(0);

  return detSch;
});

const {
  value: numValue,
  errorMessage: numError,
  handleBlur: numBlur,
} = useField(props.fieldName, validShema, {
  syncVModel: 'numVal',
});
</script>
