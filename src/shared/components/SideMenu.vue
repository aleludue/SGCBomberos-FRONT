<template>
  <nav class="navbar navbar-dark bg-dark sticky-top bg-body-tertiary">
    <div class="container-fluid">
      <button
        v-if="isMobile()"
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasDarkNavbar"
        aria-controls="offcanvasDarkNavbar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        v-if="isMobile()"
        class="offcanvas offcanvas-start text-bg-dark"
        tabindex="-1"
        id="offcanvasDarkNavbar"
        aria-labelledby="offcanvasDarkNavbarLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
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
      <h2 class="text-white">
        {{ isMobile() ? TextResource.SistemNameShort : TextResource.SistemNameLong }}
      </h2>
      <div class="dropdown">
        <!-- Botón del perfil con icono de avatar -->
        <button class="btn" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle text-white fs-4"></i>
        </button>

        <!-- Menú desplegable -->
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <a class="dropdown-item" @click="router.push({ name: 'profile' })">
              <i class="bi bi-person-lines-fill"></i> Mi Perfil
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#"><i class="bi bi-sliders"></i> Configuración</a>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <a class="dropdown-item text-center text-primary text-opacity-75" @click="siteLogout()">
              <strong>Cerrar Sesión</strong>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <nav class="sidebar d-flex flex-column flex-shrink-0 position-fixed collapsed" v-if="!isMobile()">
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
import TextResource from '@/assets/text-es.json';
import { useMenuStore } from '@/features/account/stores/menu.store';
import { isMobile, siteLogout } from '@/shared/utils/genericFuntions';
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

        // router.addRoute({
        //   path: x.route,
        //   name: x.name,
        //   props: true,
        //   component: () => import(`@/features/${x.feature}/views/${x.viewName}.vue`),
        // });
      });
    }
  },
);
</script>
