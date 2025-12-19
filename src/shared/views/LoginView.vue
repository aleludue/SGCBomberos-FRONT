<template>
  <title>SGCB - Login</title>

  <div class="container">
    <div class="col-12 mt-3">
      <h1 class="text-center">Sistema de Gestion para Cuarteles de Bomberos</h1>
    </div>

    <div class="col-12 mt-3 text-center">
      <img
        src="/LogoCuartel.png"
        alt="Login Image"
        :class="{ 'h-25 w-25': !isMobile(), 'h-50 w-50': isMobile() }"
      />
    </div>

    <div class="col-12 mt-3 p-4 rounded shadow">
      <h2>Login</h2>
      <form @submit.prevent="onLogin" class="mt-2">
        <div class="mb-3">
          <label class="form-label" for="email">Correo</label>
          <input
            v-model="myForm.email"
            ref="emailInputRef"
            type="text"
            id="email"
            name="email"
            class="form-control"
            autocomplete="off"
            placeholder="Ingrese su dirección de correo."
          />
        </div>
        <div class="mb-2">
          <label for="password" class="form-label">Contraseña</label>
          <input
            v-model="myForm.password"
            ref="passwordInputRef"
            type="password"
            id="password"
            name="password"
            class="form-control"
            autocomplete="off"
            placeholder="Ingrese su contraseña."
          />
        </div>
        <div class="mb-3 text-blue-500">
          <a href="#" class="hover:underline">¿Olvidaste la contraseña?</a>
        </div>
        <div class="text-center">
          <button type="submit" class="btn btn-outline-primary">Ingresar</button>
        </div>
      </form>
    </div>

    <div class="col-12 text-center mt-3">
      <img
        src="/LogoPrincipal.png"
        alt="Login Image"
        :class="{ 'h-25 w-25': !isMobile(), 'h-50 w-50': isMobile() }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from 'vue-toastification';
import { isMobile } from '@/shared/utils/genericFuntions';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const emailInputRef = ref<HTMLInputElement | null>(null);
const passwordInputRef = ref<HTMLInputElement | null>(null);

const myForm = reactive({
  email: '',
  password: '',
});

const onLogin = async () => {
  if (myForm.email === '') {
    return emailInputRef.value?.focus();
  }

  if (myForm.password.length < 6) {
    return passwordInputRef.value?.focus();
  }

  const ok = await authStore.login(myForm.email, myForm.password);

  if (ok) return router.replace('/');

  toast.error('Usuario/Contraseña no son correctos');
};
</script>
