<template>
  <div class="row">
    <div class="col-12 d-flex position-relative">
      <div class="col-10">
        <nav aria-label="breadcrumb" v-if="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="#" @click.prevent="$router.push({ name: 'home' })">{{
                $t('HomeView.Title')
              }}</a>
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

      <div class="col-2 p-1 position-relative d-none d-md-block text-right">
        <img
          src="/LogoPrincipal.png"
          alt="LogoImg"
          class="position-absolute top-0 start-0 w-100 h-100 text-right"
          style="object-fit: contain; object-position: right"
        />
      </div>
    </div>
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
