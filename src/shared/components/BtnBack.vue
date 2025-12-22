<template>
  <div class="text-center mt-3">
    <button class="btn btn-outline-primary" @click="$router.back()">
      <i class="bi bi-arrow-return-left"></i>
      {{ $t('Generic.BtnBack') }}
    </button>
  </div>
</template>
<script lang="ts" setup></script>
