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

      <nav>
        <div class="nav nav-tabs nav-justified" id="logTab" role="tablist">
          <button
            class="nav-link active"
            id="login-tab"
            data-bs-toggle="tab"
            data-bs-target="#login-tab-pane"
            type="button"
            role="tab"
            aria-controls="login-tab-pane"
            aria-selected="true"
          >
            {{ $t('LoginView.Title') }}
          </button>
          <button
            class="nav-link"
            id="register-tab"
            data-bs-toggle="tab"
            data-bs-target="#register-tab-pane"
            type="button"
            role="tab"
            aria-controls="register-tab-pane"
            aria-selected="false"
          >
            {{ $t('RegisterView.Title') }}
          </button>
        </div>
      </nav>

      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active border border-top-0 p-3 pt-1"
          id="login-tab-pane"
          role="tabpanel"
          aria-labelledby="login-tab"
          tabindex="0"
        >
          <LoginForm />
        </div>
        <div
          class="tab-pane fade border border-top-0 p-3 pt-1"
          id="register-tab-pane"
          role="tabpanel"
          aria-labelledby="register-tab"
          tabindex="0"
        >
          <RegisterForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/shared/components/LoginForm.vue';
import { isMobile } from '@/shared/utils/genericFuntions';
import RegisterForm from '@/shared/components/RegisterForm.vue';
</script>
