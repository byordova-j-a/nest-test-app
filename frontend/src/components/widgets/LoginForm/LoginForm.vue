<template>
  <div
    class="login-form"
    :class="{ disabled: isFormDisabled }"
  >
    <div class="header">Вход в ERP-систему</div>
    <div class="inputs-form">
      <InputItem
        :items="tabelList"
        label="Табельный номер"
        v-model="formFields.tabel"
        :type="EInputType.SELECT"
      />
      <InputItem
        :items="loginList"
        label="логин"
        v-model="formFields.login"
        :type="EInputType.SELECT"
      />
      <InputItem
        label="Пароль"
        v-model="formFields.password"
        :type="EInputType.TEXT"
      />
    </div>
    <div class="checkbox-item">
      <button
        class="checkbox default-cursor"
        @click="isAccountSaved = !isAccountSaved"
        :class="[{ checked: isAccountSaved }, { 'pointer-cursor': isMouseDown }]"
      />
      <p>Запомнить аккаунт</p>
    </div>

    <EnterButton
      :disabled="!isValid"
      :color-style="EColorType.GREY"
      @click="login"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject } from 'vue';
import InputItem from '~/components/ui/InputItem/InputItem.vue';
import { EInputType } from '~/components/ui/InputItem/models';
import { useUsersStore } from '~/stores/users';
import { EColorType } from '~/components/ui/EnterButton/models';
import EnterButton from '~/components/ui/EnterButton/EnterButton.vue';
import type { TComponentEmits } from './models';

const isMouseDown = inject('isMouseDown');
const userStore = useUsersStore();

const componentEmits = defineEmits<TComponentEmits>();

const currentUser = computed(() => userStore.currentUser);
const tabelList = computed(() => userStore.tabelList);
const loginList = computed(() => userStore.loginList);

const isFormDisabled = ref(false);

const isAccountSaved = ref(false);
const formFields = reactive({
  login: '',
  tabel: '',
  password: '',
});

const isValid = computed(() =>
  Boolean(formFields.tabel && formFields.login && formFields.password)
);

const logout = async () => {
  await userStore.logout();
};

const login = async () => {
  isFormDisabled.value = true;
  if (currentUser.value) {
    await logout();
  }
  await userStore.login({ ...formFields, isAccountSaved: isAccountSaved.value });
  isFormDisabled.value = false;
  if (currentUser.value) {
    componentEmits('authorized');
  }
};
</script>

<style scoped>
.login-form {
  width: 460px;
  height: 517px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  user-select: none;
}

.disabled {
  pointer-events: none;
}

.header {
  height: 36px;
  font-size: 30px;
  line-height: 36px;
  color: #000000;
}

.inputs-form {
  height: 311px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
}

.checkbox-item {
  height: 24px;
}

.button {
  height: 56px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
  line-height: 22px;
  color: #a6a3ad;
  user-select: none;
}

.checkbox {
  height: 24px;
  width: 24px;
  border-radius: 8px;
  padding: 0;
  background: white;
  border: 2px solid #77a6ff;
}

.checkbox.checked {
  background: #77a6ff url(@/assets/images/check-mark.svg) no-repeat center;
  background-size: 15px 12px;
}
</style>
