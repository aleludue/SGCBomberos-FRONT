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
      v-model="textValue"
      v-bind="$attrs"
      type="text"
      class="form-control"
      :class="{ 'is-invalid': textError }"
      @blur="textBlur"
      :placeholder="placeholdText"
    />
    <label v-if="isLoginForm" class="form-label" :for="uuid">
      {{ labelText }}
    </label>
    <span v-if="textError" class="error-tooltip-msg"> {{ textError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { string } from 'yup';

defineOptions({ inheritAttrs: false });

const { t } = useI18n();
const uuid = useId();

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'textField' },
  isRequired: { type: Boolean, default: false },
  maxLength: { type: Number, default: 0 },
  minLength: { type: Number, default: 0 },
  isLoginForm: { type: Boolean, default: false },
  placeholdText: { type: String, default: '' },
});

defineModel<string>('textDet');

const validSchema = computed(() => {
  let schema = string();

  if (props.isRequired) schema = schema.required(t('ValidationMsg.Required'));

  if (props.maxLength)
    schema = schema.max(props.maxLength, t('ValidationMsg.MaxLength', { max: props.maxLength }));

  if (props.minLength)
    schema = schema.min(props.minLength, t('ValidationMsg.MinLength', { min: props.minLength }));

  return schema;
});

const {
  value: textValue,
  errorMessage: textError,
  handleBlur: textBlur,
  resetField: resetTextField,
} = useField(props.fieldName, validSchema, { syncVModel: 'textDet' });

defineExpose({
  resetTextField,
});
</script>
