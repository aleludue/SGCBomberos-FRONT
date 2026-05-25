import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import { Tooltip, Popover, Dropdown } from 'bootstrap';

import 'vue-toastification/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/main.css';

import { i18n } from '@/config/i18n';
import router from '@/router';
import App from '@/App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(router);
app.use(Toast);

app.directive('tooltip', {
  mounted(el) {
    new Tooltip(el, {
      trigger: 'hover',
    });
  },
  unmounted(el) {
    const instance = Tooltip.getInstance(el);
    if (instance) instance.dispose();
  },
});

app.directive('popover', {
  mounted(el) {
    new Popover(el);
  },
  unmounted(el) {
    const instance = Popover.getInstance(el);
    if (instance) instance.dispose();
  },
});

app.directive('dropdown', {
  mounted(el) {
    new Dropdown(el);
  },
  unmounted(el) {
    const instance = Dropdown.getInstance(el);
    if (instance) instance.dispose();
  },
});

app.mount('#app');
