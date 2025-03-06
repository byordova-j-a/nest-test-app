<template>
  <div
    class="account-list"
    :class="{ loading: isLoading }"
  >
    <div class="header">
      <img
        src="@/assets/images/logo.png"
        class="logo"
        alt="logo"
      />
      <p>Вход в ERP-систему</p>
    </div>
    <div class="heading">
      <p>С возвращением!</p>
      <img
        src="@/assets/images/hi.png"
        class="hi-icon"
        alt="hi"
      />
    </div>
    <AccountItem @add-account="componentEmits('add-account')" />
    <div class="scrollable-list">
      <div class="items-list">
        <AccountItem
          v-for="{ login, tabel, id } in items"
          :login="login"
          :tabel="tabel"
          :key="id"
          @authorization="setLoadingState"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import AccountItem from '@/components/entities/AccountItem/AccountItem.vue';
import { type TComponentProps, type TComponentEmits } from './models';

const componentProps = defineProps<TComponentProps>();
const componentEmits = defineEmits<TComponentEmits>();

const storedItems = ref([]);

const isLoading = ref(false);

const items = ref<{ login: string; tabel: string; id: number }[]>([]);

const setLoadingState = (val: boolean) => {
  isLoading.value = val;
};

const setItems = () => {
  const currentUser = componentProps.currentUser;
  if (!currentUser) {
    items.value = storedItems.value;
  } else {
    items.value = [
      { ...currentUser },
      ...storedItems.value.filter(({ id }) => id !== currentUser.id),
    ];
  }
};

watch(
  () => componentProps.currentUser,
  () => {
    setItems();
  }
);

onMounted(() => {
  storedItems.value = JSON.parse(localStorage.getItem('userList') || '[]') || [];
  setItems();
});
</script>

<style scoped>
.account-list {
  position: absolute;
  box-sizing: border-box;
  height: 834px;
  width: 725px;
  background: linear-gradient(213.61deg, #a1c2ff 3.13%, #75a3fb 46.43%, #4781ee 92.74%);
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 128px 100px;
}

.account-list.loading {
  pointer-events: none;
}

.header {
  user-select: none;
  height: 112px;
  width: 247px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  position: relative;
}

.logo {
  height: 60px;
  width: 60px;
  user-select: none;
  pointer-events: none;
}

.hi-icon {
  height: 40px;
  width: 40px;
  position: relative;
  align-self: end;
  bottom: 2px;
  pointer-events: none;
}

.heading {
  position: relative;
  margin-top: 25px;
  display: flex;
  gap: 14px;
  user-select: none;
  height: 47px;
  font-size: 40px;
  line-height: 48px;
  font-weight: 700;
  color: white;
}

.scrollable-list {
  margin-top: 20px;
  height: 360px;
  width: 100%;
  overflow-y: scroll;
}

.scrollable-list::-webkit-scrollbar {
  display: none;
}

.scrollable-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.items-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
