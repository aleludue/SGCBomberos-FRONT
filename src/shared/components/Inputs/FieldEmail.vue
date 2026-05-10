<template>
  <div class="form-floating error-tooltip-wrapper">
    <input
      :id="uuid"
      v-model="emailValue"
      v-bind="$attrs"
      type="email"
      class="form-control"
      autocomplete="off"
      :placeholder="placeholdText"
      @blur="emailBlur"
      :class="{ 'is-invalid': emailError }"
    />
    <label :for="uuid">{{ labelText }}</label>
    <span v-if="emailError" class="error-tooltip-msg" role="alert"> {{ emailError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { string } from 'yup';

defineOptions({ inheritAttrs: false });

const uuid = useId();

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'emailField' },
  placeholdText: { type: String, default: '' },
});

defineModel<string>('email');

const emailSchema = computed(() => {
  return string().required().email();
});

const {
  value: emailValue,
  errorMessage: emailError,
  handleBlur: emailBlur,
  resetField: resetEmailField,
} = useField(props.fieldName, emailSchema, {
  syncVModel: 'email',
});

defineExpose({
  resetEmailField,
});
</script>
