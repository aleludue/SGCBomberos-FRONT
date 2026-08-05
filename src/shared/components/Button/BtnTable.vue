<template>
  <div class="col flex-grow-1 flex-sm-grow-0">
    <button
      v-if="props.activeBtn"
      :type="props.type"
      :class="`btn btn-sm ${props.btnClass} px-3 fw-bold w-100`"
      @click="emit('applyAction')"
    >
      <i :class="`bi ${props.icon} me-1`"></i> {{ props.text }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    activeBtn?: boolean;
    icon?: string;
    text: string;
    btnClass?: string;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    activeBtn: false,
    icon: 'bi',
    text: '',
    btnClass: 'btn-action-manage',
    type: 'button',
  },
);

const emit = defineEmits<{
  applyAction: [];
}>();
</script>
