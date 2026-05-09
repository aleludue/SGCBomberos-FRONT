<template>
  <div class="row mb-4">
    <div class="col-12 d-flex align-items-start justify-content-between">
      <div :class="showLogo ? 'col-md-10 col-12' : 'col-12'">
        <nav v-if="breadcrumb" aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="#" @click.prevent="$router.push({ name: 'home' })">
                {{ $t('HomeView.Title') }}
              </a>
            </li>
            <li
              v-for="item in breadcrumbDetail"
              :key="item.detail"
              class="breadcrumb-item"
              :class="{ active: !item.link }"
              :aria-current="item.link ? undefined : 'page'"
            >
              <a v-if="item.link" href="#" @click.prevent="$router.push(item.link)">
                {{ item.detail }}
              </a>
              <span v-else>{{ item.detail }}</span>
            </li>
          </ol>
        </nav>

        <h2 class="mb-1">{{ title }}</h2>
        <p v-if="subtitle" class="text-muted mb-0">{{ subtitle }}</p>
      </div>

      <div v-if="showLogo" class="col-md-2 d-none d-md-block text-end align-self-center">
        <img
          src="/LogoCuartel.png"
          alt="Logo"
          class="img-fluid"
          style="max-height: 90px; width: auto; object-fit: contain; object-position: right"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface BreadCrumDetail {
  detail: string;
  link?: any;
}

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  breadcrumb: { type: Boolean, default: false },
  breadcrumbDetail: { type: Array as () => BreadCrumDetail[], default: undefined },
  showLogo: { type: Boolean, default: true },
});
</script>
