<template>
  <div class="container">
    <h1>Welcome to Profileee</h1>
    <p>Info del usuario completa.</p>
    <button class="btn btn-primary" @click="router.push('/profile/detail')">Redirect</button>
    <button class="btn btn-primary" @click="router.push('/profile/detail33')">Redirect not</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  console.log('ProfileView mounted');
});
</script>
