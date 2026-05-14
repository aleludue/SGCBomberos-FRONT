<template>
  <!-- Navbar Superior -->
  <nav class="navbar navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
      <button
        class="navbar-toggler d-block d-sm-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sideMenuNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="offcanvas offcanvas-start text-bg-dark d-block d-sm-none"
        tabindex="-1"
        id="sideMenuNavbar"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Menu</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div class="offcanvas-body">
          <div class="nav flex-column">
            <a
              v-for="item in menuItems"
              :key="item.name"
              class="sidebar-link text-decoration-none p-3"
              role="button"
              data-bs-dismiss="offcanvas"
              @click="router.push(item.route)"
            >
              <i class="bi me-3" :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Logo y Título Sistema -->
      <div class="d-none d-sm-flex align-items-center">
        <img src="/LogoPrincipal.png" alt="Logo" width="40" height="40" />
      </div>

      <h2 class="text-white mb-0 fs-4">
        <span class="d-flex d-sm-none">{{ $t('GenericTexts.SistemNameShort') }}</span>
        <span class="d-none d-sm-flex">{{ $t('GenericTexts.SistemNameLong') }}</span>
      </h2>

      <!-- Dropdown Usuario -->
      <div class="dropdown">
        <button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle text-white fs-4"></i>
        </button>

        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <a class="dropdown-item" role="button" @click="router.push({ name: 'profile' })">
              <i class="bi bi-person-lines-fill me-2"></i> {{ $t('Menu.Profile') }}
            </a>
          </li>
          <li>
            <a class="dropdown-item" role="button" @click="router.push({ name: 'settings' })"
              ><i class="bi bi-sliders me-2"></i> {{ $t('Menu.Config') }}
            </a>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <a class="dropdown-item text-primary" role="button" @click="siteLogout()">
              <i class="bi bi-box-arrow-right me-2"></i><strong>{{ $t('Menu.Logout') }}</strong>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Sidebar Desktop -->
  <nav
    class="sidebar d-none d-sm-flex flex-column position-fixed"
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
        @click="router.push(item.route)"
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

const router = useRouter();
const menuStore = useMenuStore();
const isCollapsed = ref(true);

const menuItems = computed(() => {
  const baseMenu = [{ name: 'Home', icon: 'bi-house-fill', route: '/' }];

  if (!menuStore.menu) return baseMenu;

  const dynamicMenu = menuStore.menu
    .filter((x) => x.isMenu)
    .map((x) => ({
      name: x.title,
      icon: x.icon,
      route: x.route,
    }));

  return [...baseMenu, ...dynamicMenu];
});
</script>
