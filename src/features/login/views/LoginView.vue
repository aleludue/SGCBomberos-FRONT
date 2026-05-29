<template>
  <div class="d-flex align-items-start justify-content-center w-100 style-login-viewport">
    <div class="col-11 login-card-tactical shadow animate-fade-in">
      <div class="pwa-wrapper-local">
        <PwaInstaller />
      </div>

      <TitleLogoForm />

      <nav class="mb-3">
        <div class="nav nav-tabs nav-justified border-0" id="logTab" role="tablist">
          <button
            class="nav-link active fw-bold text-uppercase py-2"
            id="login-tab"
            data-bs-toggle="tab"
            data-bs-target="#login-tab-pane"
            type="button"
            role="tab"
            aria-selected="true"
          >
            {{ $t('BaseViews.LoginTitle') }}
          </button>
          <button
            class="nav-link fw-bold text-uppercase py-2"
            id="register-tab"
            data-bs-toggle="tab"
            data-bs-target="#register-tab-pane"
            type="button"
            role="tab"
            aria-selected="false"
          >
            {{ $t('BaseViews.RegisterTitle') }}
          </button>
        </div>
      </nav>

      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade px-1 show active"
          id="login-tab-pane"
          role="tabpanel"
          tabindex="0"
        >
          <LoginForm :newEmail="newMail" />
        </div>
        <div class="tab-pane fade px-1" id="register-tab-pane" role="tabpanel" tabindex="0">
          <RegisterForm @newEmail="logNewUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Tab } from 'bootstrap';
import LoginForm from '@/features/login/components/LoginForm.vue';
import RegisterForm from '@/features/login/components/RegisterForm.vue';
import PwaInstaller from '@/shared/components/PwaInstaller.vue';
import TitleLogoForm from '@/features/login/components/TitleLogoForm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const newMail = ref<string | undefined>(undefined);
let tabInstance: Tab | null = null;
const { desactivateSpinner } = useSiteConfigStore();

onMounted(() => {
  const triggerEl = document.querySelector('#login-tab');
  if (triggerEl) tabInstance = new Tab(triggerEl);
  desactivateSpinner();
});

const logNewUser = (email: string) => {
  newMail.value = email;
  tabInstance?.show();
};
</script>

<style scoped>
.style-login-viewport {
  width: 100%;
  min-height: calc(100svh - 2rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2svh 15px;
  box-sizing: border-box;
}

.login-card-tactical {
  max-width: 400px;
  margin: 0 auto;
  border-radius: 16px !important;
  padding: 2rem !important;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  background-color: var(--bs-card-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
}

:global([data-bs-theme='dark']) .login-card-tactical {
  background-color: var(--bs-card-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6) !important;
}

:global([data-bs-theme='light']) .login-card-tactical {
  background-color: var(--bs-card-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  box-shadow: 0 12px 40px rgba(51, 58, 72, 0.08) !important;
}

.pwa-wrapper-local :deep(.alert),
.pwa-wrapper-local :deep(div[style*='position: fixed']) {
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  margin-bottom: 0 !important;
  box-shadow: none !important;
}

.nav-tabs .nav-link {
  background-color: transparent !important;
  border: none !important;
  color: var(--bs-secondary-color) !important;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: 2px solid transparent !important;
  transition: all 0.2s ease;
}

.nav-tabs .nav-link.active {
  color: var(--brand-primary) !important;
  border-bottom: 2px solid var(--brand-primary) !important;
}

.nav-tabs .nav-link:hover:not(.active) {
  color: var(--bs-body-color) !important;
}

.login-card-tactical :deep(a) {
  color: var(--brand-primary) !important;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.login-card-tactical :deep(a:hover) {
  color: var(--brand-primary-dark) !important;
  text-decoration: underline;
}

.login-card-tactical :deep(.form-label),
.login-card-tactical :deep(label) {
  color: var(--bs-secondary-color) !important;
  font-weight: 600;
  font-size: 0.8rem;
}

.login-card-tactical :deep(.form-control) {
  background-color: var(--bs-input-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  color: var(--bs-body-color) !important;
  border-radius: 8px !important;
  padding: 0.75rem 1rem !important;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.login-card-tactical :deep(.form-control:focus) {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.2) !important;
}

.login-card-tactical :deep(.btn-success),
.login-card-tactical :deep(.btn-primary),
.login-card-tactical :deep(button[type='submit']) {
  background-color: var(--brand-primary) !important;
  color: var(--bs-on-brand-color) !important;
  font-weight: 700;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.75rem 2rem !important;
  width: 100% !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(var(--brand-primary-rgb), 0.15) !important;
}

.login-card-tactical :deep(.btn-success:hover),
.login-card-tactical :deep(.btn-primary:hover),
.login-card-tactical :deep(button[type='submit']:hover) {
  background-color: var(--brand-primary-dark) !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(var(--brand-primary-rgb), 0.35) !important;
}

.login-card-tactical :deep(h1),
.login-card-tactical :deep(h2),
.login-card-tactical :deep(h3) {
  color: var(--bs-body-color) !important;
}

.animate-fade-in {
  animation: fadeInStyle 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInStyle {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
