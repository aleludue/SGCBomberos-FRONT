<template>
  <div class="mobile-card-empty text-center py-3 mt-2">
    <div class="d-flex flex-column align-items-center justify-content-center gap-2">
      <i class="bi bi-journal-x mb-1 fs-3"></i>
      <span class="empty-text text-muted">{{ $t('Messages.NoRecords') }}</span>
    </div>
  </div>
</template>

<style scoped>
.mobile-card-empty {
  display: block !important;
  margin-bottom: 1rem !important;
  border: 1px solid var(--bs-border-color) !important;
  border-radius: 12px !important;
  background: var(--bs-tertiary-bg) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
  overflow: hidden;
  width: 100% !important;
}

.empty-text {
  font-style: italic;
}
</style>
