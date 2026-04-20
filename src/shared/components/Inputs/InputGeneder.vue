<template>
  <div class="col-md-6 col-sm-12 col-xs-12">
    <label for="genderField" class="form-label"> {{ props.labelText }} </label>
    <select
      v-if="!props.readonly"
      class="form-select"
      id="genderField"
      v-model="genderValue"
      @blur="genderBlur"
    >
      <option v-for="value in genderList" :key="value.value" :value="value.value">
        {{ value.label }}
      </option>
    </select>
    <input
      v-else
      readonly
      :value="genderList.find((g) => g.value === genderValue)?.label"
      type="text"
      class="form-control"
      id="detGeneder"
    />
    <span v-if="genderError" class="text-danger">{{ genderError }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const genderList = [
  { value: 0, label: t('ProfileView.GenderSelect') },
  { value: 1, label: t('ProfileView.GenderMale') },
  { value: 2, label: t('ProfileView.GenderFemale') },
  { value: 3, label: t('ProfileView.GenderOther') },
];

const props = defineProps<{
  labelText?: string;
  gender?: number;
  readonly?: boolean;
}>();

const {
  value: genderValue,
  errorMessage: genderError,
  handleBlur: genderBlur,
} = useField('gender');

watch(
  () => props.gender,
  (newVal) => {
    if (newVal !== undefined) {
      genderValue.value = newVal;
    }
  },
  { immediate: true },
);
</script>
