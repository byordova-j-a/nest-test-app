<template>
  <button
    :disabled="componentProps.disabled"
    class="enter-button"
    :class="[
      componentProps.colorStyle,
      { 'pointer-cursor': isMouseDown },
      componentProps.disabled ? 'default-cursor' : ' default-button-cursor',
    ]"
    @click="componentEmits('click')"
  >
    Войти
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { type TComponentProps, type TComponentEmits } from './models';

const isMouseDown = inject('isMouseDown');
const componentProps = defineProps<TComponentProps>();
const componentEmits = defineEmits<TComponentEmits>();
</script>

<style scoped>
.enter-button {
  width: 100%;
  height: 56px;
  font-size: 20px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  background-color: #77a6ff;
}
.enter-button.grey:disabled {
  background-color: #f5f5f5;
  color: #757d8a;
}
.enter-button.blue:disabled {
  background-color: #77a6ff;
}

.enter-button:hover {
  background-color: #548cf6;
}
</style>
