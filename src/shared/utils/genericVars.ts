import { ref } from 'vue';

export const isMobile = ref(window.innerWidth <= 768);

export function updateIsMobile() {
  isMobile.value = window.innerWidth <= 768;
}
