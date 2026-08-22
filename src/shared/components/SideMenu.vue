<template>
  <!-- Navbar Superior Adaptable -->
  <nav class="navbar sticky-top tactical-navbar">
    <div class="container-fluid">
      <!-- Botón menú móvil adaptable -->
      <button
        class="navbar-toggler d-block d-sm-none btn-noShadow"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sideMenuNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Offcanvas Móvil Adaptable -->
      <div
        class="offcanvas offcanvas-start d-block d-sm-none tactical-offcanvas"
        tabindex="-1"
        id="sideMenuNavbar"
      >
        <div class="offcanvas-header border-bottom border-secondary-subtle">
          <h5 class="offcanvas-title fw-bold text-themed-nav">Menú Principal</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
        </div>

        <div class="offcanvas-body">
          <div class="nav flex-column">
            <a
              v-for="item in menuItems"
              :key="item.name"
              class="sidebar-link text-decoration-none p-3"
              role="button"
              data-bs-dismiss="offcanvas"
              @click="goToRoute(item.route)"
            >
              <i class="bi me-3" :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Logo y Título Sistema -->
      <div class="d-none d-sm-flex align-items-center">
        <img :src="logoPrincipal" alt="Logo" width="40" height="40" />
      </div>

      <h2 class="mb-0 fs-4 text-themed-nav logo-title-text">
        <span class="d-flex d-sm-none">{{ $t('SystemBase.NameShort') }}</span>
        <span class="d-none d-sm-flex">{{ $t('SystemBase.NameLong') }}</span>
      </h2>

      <!-- Dropdown Usuario Adaptable -->
      <span v-tooltip class="d-inline-block">
        <div class="dropdown">
          <button
            class="btn border-0 btn-noShadow p-1"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle fs-4 text-themed-nav"></i>
          </button>

          <ul class="dropdown-menu dropdown-menu-end tactical-user-dropdown shadow">
            <li>
              <a class="dropdown-item py-2" role="button" @click="goToNameRoute('profile')">
                <i class="bi bi-person-lines-fill me-2"></i> {{ $t('Buttons.Profile') }}
              </a>
            </li>
            <li>
              <a class="dropdown-item py-2" role="button" @click="goToNameRoute('settings')">
                <i class="bi bi-sliders me-2"></i> {{ $t('Buttons.Config') }}
              </a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item text-danger py-2" role="button" @click="siteLogout()">
                <i class="bi bi-door-open me-2"></i><strong>{{ $t('Buttons.Logout') }}</strong>
              </a>
            </li>
          </ul>
        </div>
      </span>
    </div>
  </nav>

  <!-- Sidebar Desktop Adaptable -->
  <nav
    class="sidebar d-none d-sm-flex flex-column position-fixed tactical-sidebar"
    :class="{ collapsed: isCollapsed }"
  >
    <button class="toggle-btn" @click="isCollapsed = !isCollapsed">
      <i class="bi bi-arrow-bar-left"></i>
    </button>

    <div class="nav flex-column">
      <a
        v-for="item in menuItems"
        :key="item.name"
        class="sidebar-link text-decoration-none p-3"
        role="button"
        @click="goToRoute(item.route)"
      >
        <i class="bi me-3" :class="item.icon"></i>
        <span class="hide-on-collapse">{{ item.name }}</span>
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useMenuStore } from '@/shared/stores/menu.store';
import { siteLogout } from '@/shared/utils/genericFuntions';

const logoPrincipal = new URL('../../assets/LogoPrincipal.png', import.meta.url).href;

const router = useRouter();
const menuStore = useMenuStore();
const isCollapsed = ref(true);

const menuItems = computed(() => {
  const baseMenu = [{ name: 'Home', icon: 'bi-house-fill', route: '/' }];

  if (!menuStore.menu) return baseMenu;

  const dynamicMenu = menuStore.menu
    .filter((x) => x.isMenu)
    .map((x) => ({
      name: x.name,
      icon: x.icon,
      route: x.route,
    }));

  return [...baseMenu, ...dynamicMenu];
});

const goToRoute = async (route: string) => {
  await router.push(route);
};

const goToNameRoute = async (name: string) => {
  await router.push({ name: name });
};
</script>

<style scoped>
.tactical-user-dropdown {
  background-color: var(--bs-dropdown-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  border-radius: 8px !important;
  padding: 6px 0 !important;
  box-shadow: 0 10px 25px rgba(51, 58, 72, 0.15) !important;
}

.tactical-user-dropdown :deep(.dropdown-item),
:global(.tactical-user-dropdown .dropdown-item) {
  color: var(--bs-dropdown-text) !important;
  font-size: 0.875rem;
  font-weight: 600 !important;
  transition: all 0.15s ease;
}

.tactical-user-dropdown :deep(.dropdown-item i),
:global(.tactical-user-dropdown .dropdown-item i) {
  color: var(--bs-dropdown-icon) !important;
}

.tactical-user-dropdown :deep(.dropdown-item:hover),
:global(.tactical-user-dropdown .dropdown-item:hover) {
  background-color: var(--bs-secondary-bg) !important;
  color: var(--brand-primary) !important;
}

.tactical-user-dropdown :deep(.dropdown-item:hover i),
:global(.tactical-user-dropdown .dropdown-item:hover i) {
  color: var(--brand-primary) !important;
}

.tactical-user-dropdown :deep(.dropdown-divider),
:global(.tactical-user-dropdown .dropdown-divider) {
  border-top: 1px solid var(--bs-border-color) !important;
  opacity: 0.8;
}

.tactical-user-dropdown :deep(.dropdown-item.text-danger),
:global(.tactical-user-dropdown .dropdown-item.text-danger) {
  color: var(--brand-danger) !important;
  font-weight: 700 !important;
}

.tactical-user-dropdown :deep(.dropdown-item.text-danger:hover),
:global(.tactical-user-dropdown .dropdown-item.text-danger:hover) {
  background-color: var(--brand-danger-light) !important;
  color: var(--brand-danger) !important;
}

.tactical-offcanvas {
  background-color: var(--bs-dropdown-bg) !important;
}
</style>
