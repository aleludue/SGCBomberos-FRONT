<template>
  <div>
    <h1>Welcome to Profileee</h1>
    <p>Info del usuario completa.</p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('ProfileView mounted');
});
</script>
