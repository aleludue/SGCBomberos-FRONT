<template>
  <PwaInstaller />

  <div class="container p-3">
    <div class="col-11 p-4 pt-3 rounded shadow bg-body" style="max-width: 400px; margin: auto">
      <TitleLogoForm />

      <nav>
        <div class="nav nav-tabs nav-justified" id="logTab" role="tablist">
          <button
            class="nav-link active"
            id="login-tab"
            data-bs-toggle="tab"
            data-bs-target="#login-tab-pane"
            type="button"
            role="tab"
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
          tabindex="0"
        >
          <LoginForm :newEmail="newMail" />
        </div>

        <div
          class="tab-pane fade border border-top-0 p-3 pt-1"
          id="register-tab-pane"
          role="tabpanel"
          tabindex="0"
        >
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

const newMail = ref<string | undefined>(undefined);
let tabInstance: Tab | null = null;

onMounted(() => {
  const triggerEl = document.querySelector('#login-tab');
  if (triggerEl) tabInstance = new Tab(triggerEl);
});

const logNewUser = (email: string) => {
  newMail.value = email;
  tabInstance?.show();
};
</script>
