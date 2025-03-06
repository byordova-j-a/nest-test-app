<template>
  <div
    class="notification-item"
    :class="{ showing: isNotificationShowing }"
  >
    <p>{{ currentNotification?.message }}</p>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useNotificationsStore } from '@/stores/notifications';

const notificationsStore = useNotificationsStore();
const currentNotification = computed(() => notificationsStore.getCurrentNotification);
const isNotificationShowing = ref(false);

watch(
  () => notificationsStore.getCurrentNotification,
  currentNotification => {
    if (!currentNotification) return;
    isNotificationShowing.value = true;
    setTimeout(() => {
      isNotificationShowing.value = false;
      setTimeout(() => {
        notificationsStore.removeCurrentNotification();
      }, 500);
    }, 2000);
  }
);
</script>

<style scoped>
.notification-item {
  user-select: none;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #77a6ff;
  transform: translateY(100%);
  transition-property: transform;
  transition-duration: 400ms;
  border-top-left-radius: 10px;
  color: white;
  font-size: 18px;
}
.notification-item p {
  text-align: center;
}
.showing {
  transform: translateY(0%);
}
</style>
