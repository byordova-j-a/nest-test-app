<template>
  <div
    class="account-item"
    :class="[
      isAccountExist ? 'existed' : 'new',
      { expanded: isExpanded },
      { authorized: isAuthorized },
    ]"
  >
    <div
      class="panel-header"
      @click="clickHandler"
      @keydown.tab="tabHandler"
      tabindex="0"
      :class="{ 'pointer-cursor': isMouseDown }"
    >
      <div class="circle">
        <div class="plus-horizontal-part"></div>
        <div class="plus-vertical-part"></div>
      </div>
      <div class="text-content">
        <div
          v-if="isAccountExist"
          class="header"
        >
          <span>{{ login }}</span>
          <div
            class="check-mark"
            v-show="isAuthorized"
          />
        </div>
        <p class="text">{{ text }}</p>
      </div>
    </div>
    <div
      class="panel-content"
      v-if="isAccountExist"
    >
      <div class="line" />
      <InputItem
        label="Пароль"
        :style="EStyleType.TONAL"
        v-model="password"
        v-model:reset-input="resetInput"
        :type="EInputType.TEXT"
      />
      <EnterButton
        :disabled="isButtonDisabled"
        :color-style="EColorType.BLUE"
        @click="logIn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import type { TComponentProps, TComponentEmits } from './models';
import InputItem from '~/components/ui/InputItem/InputItem.vue';
import { EInputType, EStyleType } from '~/components/ui/InputItem/models';
import { EColorType } from '~/components/ui/EnterButton/models';
import EnterButton from '~/components/ui/EnterButton/EnterButton.vue';
import { useUsersStore } from '~/stores/users';

const isMouseDown = inject('isMouseDown');

const componentProps = defineProps<TComponentProps>();
const componentEmits = defineEmits<TComponentEmits>();
const usersStore = useUsersStore();
const currentUser = computed(() => usersStore.getUser);

const resetInput = ref(false);

const isExpanded = ref(false);
const isAuthorized = computed(
  () =>
    Boolean(usersStore.currentUser) &&
    isAccountExist.value &&
    usersStore.currentUser?.login === componentProps.login
);

const password = ref('');

const logIn = async () => {
  const { login, tabel } = componentProps;
  if (!(login && tabel && password.value)) return;

  componentEmits('authorization', true);
  await usersStore.login({ login, tabel, password: password.value, isAccountSaved: false });
  if (currentUser.value?.login === login) {
    isExpanded.value = false;
    resetInput.value = true;
  }
  componentEmits('authorization', false);
};

const isAccountExist = computed(() => Boolean(componentProps.login && componentProps.tabel));
const text = computed(() => (isAccountExist.value ? componentProps.tabel : 'Добавить аккаунт'));

const isButtonDisabled = computed(() => !password.value);

const tabHandler = () => {
  if (!isAccountExist.value) {
    return;
  }
  isExpanded.value = true;
};

const clickHandler = () => {
  if (!isAccountExist.value) {
    componentEmits('add-account');
    return;
  }
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.account-item {
  position: relative;
  user-select: none;
  height: 90px;
  width: 100%;
  background-color: rgb(255 255 255 / 0.5);
  border-radius: 20px;
  overflow: hidden;
}

.account-item.authorized {
  pointer-events: none;
}

.panel-header {
  position: relative;
  height: 90px;
  padding: 0 25px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.panel-content {
  position: relative;
  height: 198px;
  padding: 15px 25px 25px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.line {
  width: calc(100% - 50px);
  height: 2px;
  position: absolute;
  top: -1px;
}

.account-item.expanded {
  height: 288px;
}

.account-item.expanded .line {
  background-color: #77a6ff;
}

.account-item.new {
  backdrop-filter: blur(30px);
  margin-top: 40px;
}

.check-mark {
  width: 22px;
  height: 22px;
  background-color: #4781ee;
  mask: url(@/assets/images/check-mark.svg) no-repeat center;
  -webkit-mask: url(@/assets/images/check-mark.svg) no-repeat center;
}

.account-item.existed .circle {
  background: no-repeat url(@/assets/images/Pusheen.jpg);
  background-size: cover;
}

.account-item.new .circle {
  background-color: white;
}

.circle {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.plus-horizontal-part {
  position: absolute;
  width: 22px;
  height: 3px;
  background: #677074;
  border-radius: 5px;
}

.plus-vertical-part {
  position: absolute;
  width: 22px;
  height: 3px;
  background: #677074;
  border-radius: 5px;
  transform: rotate(90deg);
}

.account-item:not(.new) .plus-vertical-part,
.account-item:not(.new) .plus-horizontal-part {
  display: none;
}

.text-content {
  height: 51px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.new .text-content {
  justify-content: center;
}

.header {
  color: #111111;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  gap: 4px;
}

.text {
  color: #757d8a;
  font-size: 16px;
  line-height: 19px;
}
</style>
