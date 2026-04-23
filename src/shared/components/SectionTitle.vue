<template>
  <div class="row">
    <nav aria-label="breadcrumb" v-if="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#" @click.prevent="$router.push({ name: 'home' })">{{ $t('HomeView.Title') }}</a>
        </li>
        <li
          v-for="item in breadcrumbDetail"
          :key="item.detail"
          class="breadcrumb-item"
          :class="{ active: !item.link }"
          :aria-current="item.link ? undefined : 'page'"
        >
          <a href="#" v-if="item.link" @click.prevent="$router.push(item.link)">
            {{ item.detail }}
          </a>
          <span v-else>{{ item.detail }}</span>
        </li>
      </ol>
    </nav>

    <h2>{{ title }}</h2>
    <p v-if="subtitle" class="mb-1">{{ subtitle }}</p>
  </div>
</template>

<script lang="ts" setup>
interface BreadCrumDetail {
  detail: string;
  link?: string;
}

const {
  title = undefined,
  subtitle = undefined,
  breadcrumb = false,
  breadcrumbDetail = [] as BreadCrumDetail[],
} = defineProps(['title', 'subtitle', 'breadcrumb', 'breadcrumbDetail']);
</script>
