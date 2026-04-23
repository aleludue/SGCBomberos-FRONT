<template>
  <nav class="navbar navbar-dark bg-dark sticky-top bg-body-tertiary">
    <div class="container-fluid">
      <button
        class="navbar-toggler d-block d-sm-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sideMenuNavbar"
        aria-controls="sideMenuNavbar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="offcanvas offcanvas-start text-bg-dark d-block d-sm-none"
        tabindex="-1"
        id="sideMenuNavbar"
        aria-labelledby="sideMenuLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="sideMenuLabel">Menu</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div class="nav flex-column">
            <a
              @click="router.push(item.route)"
              class="sidebar-link text-decoration-none p-3"
              v-for="item in menuItems"
              :key="item.name"
              data-bs-dismiss="offcanvas"
            >
              <i class="bi me-3" :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="d-none d-sm-flex align-items-center">
        <img src="/LogoPrincipal.png" alt="Recover Image" width="50" height="50" />
      </div>

      <h2 class="d-flex d-sm-none text-white">
        {{ $t('GenericTexts.SistemNameShort') }}
      </h2>

      <h2 class="d-none d-sm-flex text-white">
        {{ $t('GenericTexts.SistemNameLong') }}
      </h2>

      <div class="dropdown">
        <!-- Botón del perfil con icono de avatar -->
        <button class="btn" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle text-white fs-4"></i>
        </button>

        <!-- Menú desplegable -->
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <a class="dropdown-item" role="button" @click="router.push({ name: 'profile' })">
              <i class="bi bi-person-lines-fill"></i> {{ $t('Menu.Profile') }}
            </a>
          </li>
          <li>
            <a class="dropdown-item" role="button" @click="router.push({ name: 'settings' })"
              ><i class="bi bi-sliders"></i> {{ $t('Menu.Config') }}
            </a>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <a class="dropdown-item text-center text-primary text-opacity-75" @click="siteLogout()">
              <strong>{{ $t('Menu.Logout') }}</strong>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <nav class="sidebar d-none d-sm-flex flex-column flex-shrink-0 position-fixed collapsed">
    <div>
      <button class="toggle-btn" @click="toggleSidebar()">
        <i class="bi bi-arrow-bar-left"></i>
      </button>

      <div class="nav flex-column">
        <a
          class="sidebar-link text-decoration-none p-3"
          v-for="item in menuItems"
          :key="item.name"
          @click="router.push(item.route)"
        >
          <i class="bi me-3" :class="item.icon"></i>
          <span class="hide-on-collapse">{{ item.name }}</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/shared/stores/menu.store';
import { siteLogout } from '@/shared/utils/genericFuntions';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuStore = useMenuStore();

const menuItemHome = { name: 'Home', icon: 'bi-house-fill', route: '/' };
const menuItems = ref([menuItemHome]);

const toggleSidebar = () => {
  document.querySelector('.sidebar')!.classList.toggle('collapsed');
};

watch(
  () => menuStore.menu,
  (newValue) => {
    menuItems.value = [menuItemHome];

    if (newValue != undefined) {
      newValue.forEach((x) => {
        if (x.isMenu) {
          menuItems.value.push({
            name: x.title,
            icon: x.icon,
            route: x.route,
          });
        }
      });
    }
  },
  { immediate: true },
);
</script>
