<template>
  <div class="col-12 text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <input
      :id="uuid"
      v-model="emailValue"
      v-bind="$attrs"
      type="email"
      class="form-control tactical-input-email"
      autocomplete="off"
      :placeholder="placeholdText || 'ejemplo@correo.com'"
      @blur="emailBlur"
      :class="{ 'is-invalid': emailError }"
    />

    <span v-if="emailError" class="error-tooltip-msg" role="alert">
      {{ emailError }}
    </span>
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
} = useField(props.fieldName, emailSchema, { syncVModel: 'email' });

defineExpose({
  resetEmailField,
});
</script>

<style scoped>
.text-secondary-themed {
  color: #94a3b8 !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-input-email {
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  border-radius: 8px !important;
}

.tactical-input-email:focus {
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.2) !important;
}
</style>
