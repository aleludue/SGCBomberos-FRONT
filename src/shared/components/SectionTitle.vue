<template>
  <div class="row">
    <nav aria-label="breadcrumb" v-if="props.breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a @click.prevent="$router.push({ name: 'home' })">{{ $t('HomeView.Title') }}</a>
        </li>
        <li
          v-for="item in props.breadcrumbDetail"
          :key="item.detail"
          class="breadcrumb-item"
          :class="{ active: !item.link }"
          :aria-current="item.link ? undefined : 'page'"
        >
          <a v-if="item.link" @click.prevent="$router.push({ name: item.link })">
            {{ item.detail }}
          </a>
          <span v-else>{{ item.detail }}</span>
        </li>
      </ol>
    </nav>

    <h2>{{ props.title }}</h2>
    <p v-if="props.subtitle" class="mb-1">{{ props.subtitle }}</p>
  </div>
</template>

<script lang="ts" setup>
interface BreadCrumDetail {
  detail: string;
  link?: string;
  redirect?: boolean;
}

const props = defineProps<{
  title: string;
  subtitle?: string;
  breadcrumb?: boolean;
  breadcrumbDetail?: BreadCrumDetail[];
}>();
</script>
