<template>
  <div class="row mb-3 header-section-container">
    <div class="col-12 d-flex align-items-center justify-content-between">
      <!-- Sección de textos adaptable -->
      <div :class="showLogo ? 'col-9 col-md-10' : 'col-12'">
        <!-- Breadcrumb táctico suavizado -->
        <nav v-if="breadcrumb" aria-label="breadcrumb" class="mb-1">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item">
              <a
                href="#"
                class="breadcrumb-link-custom"
                @click.prevent="$router.push({ name: 'home' })"
              >
                {{ $t('HomeView.Title') }}
              </a>
            </li>
            <li
              v-for="item in breadcrumbDetail"
              :key="item.detail"
              class="breadcrumb-item"
              :class="{ active: !item.link }"
              :aria-current="item.link ? undefined : 'page'"
            >
              <a
                v-if="item.link"
                href="#"
                class="breadcrumb-link-custom"
                @click.prevent="$router.push(item.link)"
              >
                {{ item.detail }}
              </a>
              <span v-else class="breadcrumb-active-custom">{{ item.detail }}</span>
            </li>
          </ol>
        </nav>

        <!-- Título principal -->
        <h2 class="mb-1 fw-bold text-title-custom fs-3">{{ title }}</h2>
        <!-- Subtítulo suavizado -->
        <p v-if="subtitle" class="text-subtitle-custom mb-0 small">{{ subtitle }}</p>
      </div>

      <!-- Contenedor del Logo (Adaptable para móvil y escritorio) -->
      <div v-if="showLogo" class="col-3 col-md-2 text-end align-self-center">
        <img src="/LogoCuartel.png" alt="Logo" class="img-fluid logo-cuartel-header" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface BreadCrumDetail {
  detail: string;
  link?: any;
}

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  breadcrumb: { type: Boolean, default: false },
  breadcrumbDetail: { type: Array as () => BreadCrumDetail[], default: undefined },
  showLogo: { type: Boolean, default: true },
});
</script>

<style scoped>
.breadcrumb-link-custom {
  color: var(--bs-secondary-color) !important;
  text-decoration: none;
  font-size: 0.825rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.breadcrumb-link-custom:hover {
  color: #ff6b00 !important;
}

.breadcrumb-active-custom {
  color: var(--bs-body-color);
  font-size: 0.825rem;
  font-weight: 600;
  opacity: 0.85;
}

:deep(.breadcrumb-item + .breadcrumb-item::before) {
  color: var(--bs-border-color);
}

.text-title-custom {
  color: var(--bs-body-color);
}

.text-subtitle-custom {
  color: var(--bs-secondary-color) !important;
  opacity: 0.85;
}

.logo-cuartel-header {
  max-height: 80px;
  width: auto;
  object-fit: contain;
  object-position: right;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
}

@media (max-width: 575.98px) {
  .logo-cuartel-header {
    max-height: 55px;
  }
}
</style>
