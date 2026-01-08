<template>
  <title>{{ $t('LoginView.ViewTitle') }}</title>

  <div class="container">
    <div class="col-12 mt-3 p-4 pt-2 rounded shadow bg-body" style="max-width: 400px; margin: auto">
      <div class="col-12 text-center">
        <h1>{{ $t('SistemNameLong') }}</h1>
      </div>

      <div class="col-12 text-center mb-4">
        <img
          src="/LogoPrincipal.png"
          alt="Login Image"
          :class="{ 'h-25 w-25': !isMobile(), 'h-50 w-50': isMobile() }"
        />
      </div>

      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/shared/components/LoginForm.vue';
import { isMobile } from '@/shared/utils/genericFuntions';
</script>
