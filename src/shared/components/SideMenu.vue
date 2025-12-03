<template>
  <nav class="navbar sticky-top bg-body-tertiary">
    <div class="container-fluid">
      <button class="btn btn-success ms-1" type="button" @click="toggleSidebar()">
        <i class="bi bi-menu-button"></i>
      </button>
      <h2 class="text-white">Sist. Gestión Cuartel de Bomberos</h2>
      <a class="navbar-brand fw-bold" href="#"><i class="bi bi-person-circle text-white"></i> </a>
    </div>
  </nav>

  <nav class="sidebar d-flex flex-column flex-shrink-0 position-fixed collapsed">
    <button class="toggle-btn" @click="toggleSidebar()">
      <i class="bi bi-arrow-bar-left"></i>
    </button>

    <div class="nav flex-column">
      <a href="#" class="sidebar-link text-decoration-none p-3">
        <i class="bi bi-house-fill me-3"></i>
        <span class="hide-on-collapse">A</span>
      </a>
      <a href="#" class="sidebar-link text-decoration-none p-3">
        <i class="bi bi-house-fill me-3"></i>
        <span class="hide-on-collapse">A</span>
      </a>
      <a href="#" class="sidebar-link text-decoration-none p-3">
        <i class="bi bi-house-fill me-3"></i>
        <span class="hide-on-collapse">A</span>
      </a>
      <a href="#" class="sidebar-link text-decoration-none p-3">
        <i class="bi bi-house-fill me-3"></i>
        <span class="hide-on-collapse">A</span>
      </a>
      <a href="#" class="sidebar-link text-decoration-none p-3">
        <i class="bi bi-house-fill me-3"></i>
        <span class="hide-on-collapse">A</span>
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
const toggleSidebar = () => {
  document.querySelector('.sidebar')!.classList.toggle('collapsed');
};
</script>
