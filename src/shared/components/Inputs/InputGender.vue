<template>
  <div v-if="!readonly" class="col-md-4 col-sm-12 col-xs-12">
    <label for="genderField" class="form-label">
      {{ labelText }}
    </label>
    <select class="form-select" id="genderField" v-model="genderValue" @blur="genderBlur">
      <option v-for="value in genderList" :key="value.value" :value="value.value">
        {{ value.label }}
      </option>
    </select>
    <span v-if="genderError" class="text-danger">{{ genderError }}</span>
  </div>

  <div
    v-if="readonly && gender !== undefined"
    class="col-md-4 col-sm-12 col-xs-12 d-flex flex-wrap align-items-center"
  >
    <p class="m-0 me-2">{{ labelText }}</p>

    <p class="m-0">
      <strong>{{ genderList.find((g) => g.value === gender)?.label }}</strong>
    </p>
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

const {
  labelText = undefined,
  gender = undefined,
  readonly = false,
} = defineProps(['labelText', 'gender', 'readonly']);

const {
  value: genderValue,
  errorMessage: genderError,
  handleBlur: genderBlur,
} = useField('gender');

watch(
  () => gender,
  (newVal) => {
    if (newVal !== undefined) {
      genderValue.value = newVal;
    }
  },
  { immediate: true },
);
</script>
