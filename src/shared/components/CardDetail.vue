<template>
  <div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
    <div class="person-card p-3 rounded position-relative w-100 d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h6 class="card-title m-0 fw-bold text-truncate" style="max-width: 60%">
          {{ titleText }}
        </h6>

        <div class="d-flex align-items-center gap-2" style="margin-top: -2px">
          <span v-if="statusText" class="badge status-badge">{{ statusText }}</span>
          <button @click="removePerson" class="btn-delete p-0 m-0" :title="$t('Buttons.Delete')">
            &times;
          </button>
        </div>
      </div>

      <div class="card-body-text flex-grow-1">
        <div v-for="(det, index) in bodyTitles" :key="det" class="mb-1">
          <span v-if="bodyText[index]" class="fw-bold">{{ det }}: </span>
          <span>{{ bodyText[index] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    bodyTitles?: string[];
    bodyText?: string[];
    titleText?: string;
    statusText?: string;
  }>(),
  {
    bodyTitles: () => [],
    bodyText: () => [],
    titleText: '',
    statusText: '',
  },
);

const emit = defineEmits<{
  close: [];
}>();

const removePerson = () => {
  emit('close');
};
</script>

<style lang="css" scoped>
.person-card {
  border-left: 4px solid var(--brand-primary) !important;
  background-color: var(--bs-tertiary-bg) !important;
  border: 1px solid var(--bs-border-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.person-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
}

.card-title {
  max-width: 70%;
  color: var(--bs-body-color) !important;
}

.status-badge {
  font-size: 0.75rem;
  border: 1px solid var(--brand-primary);
  color: var(--brand-primary);
  padding: 0.35em 0.65em;
  background-color: var(--bs-tertiary-bg);
}

.card-body-text {
  font-size: 0.85rem;
  line-height: 1.5;
}

.btn-delete {
  background: none;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0 5px;
  transition: color 0.2s ease;
  color: var(--bs-body-color) !important;
}

.btn-delete:hover {
  color: var(--brand-danger) !important;
}
</style>
