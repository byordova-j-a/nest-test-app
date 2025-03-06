<template>
  <div class="content">
    <div
      class="content-header"
      v-show="isBackButtonShown"
    >
      <button
        class="back-button default-button-cursor"
        @click="isAccountListShown = true"
        :class="{ 'pointer-cursor': isMouseDown }"
      >
        <div class="arrow" />
        <p>Назад</p>
      </button>
      <img
        src="@/assets/images/logo.png"
        class="logo"
        alt="logo"
      />
    </div>
    <template v-if="!isCurrentUserFetching">
      <AccountList
        v-if="isAccountListShown"
        :current-user="currentUser"
        @add-account="isAccountListShown = false"
      />
      <LoginForm
        v-else
        @authorized="isAccountListShown = true"
      />
      <div
        class="content-footer"
        v-if="isContentFooterShown"
      >
        <div class="page-determinant">
          <div
            class="circle"
            :class="{ active: isAccountListShown }"
          />
          <div
            class="circle"
            :class="{ active: !isAccountListShown }"
          />
        </div>
      </div>
    </template>
    <NotificationItem />
  </div>
</template>

<script setup lang="ts">
import AccountList from '~/components/widgets/AccountList/AccountList.vue';
import { ref, onMounted, onBeforeMount, computed, provide, onUnmounted } from 'vue';
import LoginForm from '~/components/widgets/LoginForm/LoginForm.vue';
import { useUsersStore } from '~/stores/users';
import NotificationItem from '@/components/entities/NotificationItem/NotificationItem.vue';

const isMouseDown = ref(false);
provide('isMouseDown', isMouseDown);

const userStore = useUsersStore();
const currentUser = computed(() => userStore.currentUser);
const isCurrentUserFetching = ref(false);

const isLocalStorageDataExist = Boolean(
  JSON.parse(localStorage.getItem('userList') || '[]').length
);

const isAccountListShown = ref(isLocalStorageDataExist);

const isContentFooterShown = computed(() => isLocalStorageDataExist || currentUser.value);

const isBackButtonShown = computed(
  () => !isAccountListShown.value && (isLocalStorageDataExist || currentUser.value)
);

const mousedownHandler = () => {
  isMouseDown.value = true;
};

const mouseupHandler = () => {
  isMouseDown.value = false;
};

onMounted(() => {
  document.addEventListener('mousedown', mousedownHandler);
  document.addEventListener('mouseup', mouseupHandler);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', mousedownHandler);
  document.removeEventListener('mouseup', mouseupHandler);
});

onBeforeMount(async () => {
  isCurrentUserFetching.value = true;
  await userStore.fetchUser();
  if (currentUser.value) {
    isAccountListShown.value = true;
  }
  isCurrentUserFetching.value = false;

  userStore.fetchLoginList();
  userStore.fetchTabelNumberList();
});
</script>

<style scoped>
.content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 25px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.content-header {
  position: absolute;
  top: 0;
  width: calc(100% - 100px);
  box-sizing: border-box;
  margin: 45px 50px 0px;
  height: 105px;
}

.back-button {
  position: absolute;
  user-select: none;
  left: 0;
  height: 52px;
  width: 120px;
  display: flex;
  padding: 0px 13px;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  color: #181818;
  border: none;
  background-color: white;
  font-size: 20px;
  line-height: 24px;
}
.back-button:hover {
  background-color: #f8f9fd;
}
.back-button:active {
  background-color: #ecf3ff;
  color: #77a6ff;
}
.arrow {
  height: 24px;
  width: 24px;
  background: currentColor;
  mask: url(/src/assets/images/left-arrow.svg) no-repeat center;
  -webkit-mask: url(/src/assets/images/left-arrow.svg) no-repeat center;
}

.logo {
  position: absolute;
  height: 60px;
  width: 60px;
  right: 0;
  user-select: none;
  pointer-events: none;
}

.content-footer {
  height: 65px;
  bottom: 0;
  position: absolute;
}
.page-determinant {
  height: 15px;
  width: 40px;
  display: flex;
  justify-content: space-between;
}

.circle {
  height: 11px;
  width: 11px;
  background-color: #d5d5d6;
  border-radius: 50%;
}

.circle.active {
  background-color: #77a6ff;
}
</style>
