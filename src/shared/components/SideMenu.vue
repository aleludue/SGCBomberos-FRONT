<template>
  <nav class="navbar navbar-dark bg-dark sticky-top bg-body-tertiary">
    <div class="container-fluid">
      <button
        v-if="isMobile"
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
        v-if="isMobile"
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
              href="#"
              class="sidebar-link text-decoration-none p-3"
              v-for="item in menuItems"
              :key="item.name"
            >
              <i class="bi bi-house-fill me-3" :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </div>
      <h2 class="text-white">{{ titleDetail }}</h2>
      <div class="dropdown">
        <!-- Botón del perfil con icono de avatar -->
        <a class="navbar-brand" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle text-white"></i>
        </a>

        <!-- Menú desplegable -->
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" @click="goProfile">Mi Perfil</a></li>
          <li><a class="dropdown-item" href="#">Configuración</a></li>
          <li><hr class="dropdown-divider" /></li>
          <li><a class="dropdown-item" @click="logoutSite">Cerrar Sesión</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <nav class="sidebar d-flex flex-column flex-shrink-0 position-fixed collapsed" v-if="!isMobile">
    <div>
      <button class="toggle-btn" @click="toggleSidebar()">
        <i class="bi bi-arrow-bar-left"></i>
      </button>

      <div class="nav flex-column">
        <a
          href="#"
          class="sidebar-link text-decoration-none p-3"
          v-for="item in menuItems"
          :key="item.name"
        >
          <i class="bi bi-house-fill me-3" :class="item.icon"></i>
          <span class="hide-on-collapse">{{ item.name }}</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import TextResource from '@/assets/text-es.json';
import { ref, watch } from 'vue';
import { isMobile } from '@/shared/utils/genericVars';
import { siteLogout } from '@/shared/utils/genericFuntions';
import { useRouter } from 'vue-router';

const router = useRouter();

const titleDetail = ref(
  isMobile.value ? TextResource.SistemNameShort : TextResource.SistemNameLong,
);

watch(isMobile, (newVal) => {
  titleDetail.value = newVal ? TextResource.SistemNameShort : TextResource.SistemNameLong;
});

const menuItems = [
  { name: 'Home', icon: 'bi-house-fill', route: '/' },
  { name: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' },
  { name: 'Settings', icon: 'bi-gear-fill', route: '/settings' },
];

const toggleSidebar = () => {
  document.querySelector('.sidebar')!.classList.toggle('collapsed');
};

const logoutSite = () => {
  siteLogout();
};

const goProfile = () => {
  router.push({ name: 'profile' });
};
</script>
