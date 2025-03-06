<template>
  <div
    class="input-item"
    :class="{ active: isInputItemActive }"
  >
    <div
      class="label"
      :class="componentProps.type"
    >
      <p>{{ label }}</p>
      <div
        v-if="!isSelectType"
        @click="isPasswordShown = !isPasswordShown"
        class="password-visibility-switcher default-cursor"
        :class="{ 'pointer-cursor': isMouseDown }"
      >
        <img
          :src="eyeIcon"
          alt="eye"
        />
      </div>
    </div>
    <div :id="inputItemId">
      <input
        :placeholder="'Введите ' + label"
        @focus="focus"
        class="input default-cursor"
        :class="[componentProps.style, { 'pointer-cursor': isMouseDown }]"
        :autocomplete="autocomplete"
        @blur="blur"
        v-model="inputValue"
        :type="type"
      />
      <div
        class="dropdown-menu-wrapper"
        v-show="isSelectType && isInputItemActive"
      >
        <div class="dropdown-menu">
          <button
            v-for="{ id, value } in showedItems"
            :key="id"
            @click="selectItem(value)"
            class="menu-element default-cursor"
            :class="{ 'pointer-cursor': isMouseDown }"
            @keydown.tab="tab(showedItems[showedItems.length - 1].id === id)"
          >
            {{ value }}
          </button>
          <div
            v-show="!showedItems.length"
            class="menu-element empty-message"
          >
            Нет элементов
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, useId, onUnmounted, inject } from 'vue';
import { type TComponentProps, defalutProps, EInputType } from './models';

const isMouseDown = inject('isMouseDown');
const inputItemId = 'input-field-' + useId();
const componentProps = withDefaults(defineProps<TComponentProps>(), defalutProps);
const isInputItemActive = ref(false);

const autocomplete = computed(() => (isSelectType.value ? 'off' : 'on'));

const label = computed(() => componentProps.label.toLowerCase());

const isPasswordShown = ref(false);

const eyeIcon = computed(
  () =>
    new URL(
      `/src/assets/images/eye-${isPasswordShown.value ? 'opened' : 'closed'}.svg`,
      import.meta.url
    ).href
);

const selectedItemValue = defineModel<string>({
  required: true,
});

const resetInput = defineModel<boolean>('resetInput', {
  default: false,
});

const isSelectType = computed(() => componentProps.type === EInputType.SELECT);

const showedItems = ref(componentProps.items);
const inputValue = ref('');

const type = computed(() => (isSelectType.value || isPasswordShown.value ? 'text' : 'password'));

const focus = () => {
  setTimeout(() => {
    setInputItemState(true);
  }, 100);
};

watch([() => inputValue.value, () => componentProps.items], () => {
  if (!isSelectType.value) {
    selectedItemValue.value = inputValue.value;
    return;
  }
  const regex = new RegExp(`^${inputValue.value}`);
  showedItems.value = componentProps.items.filter(item => regex.test(item.value));
  if (selectedItemValue.value && isInputItemActive.value) {
    selectedItemValue.value = '';
  }
});

const blur = () => {
  if (!isSelectType.value || !showedItems.value.length) {
    reset();
    setInputItemState();
  }
};

const tab = (val: boolean) => {
  if (val) {
    setTimeout(() => {
      setInputItemState();
    }, 0);
  }
};

const reset = () => {
  if (isSelectType.value) {
    if (!selectedItemValue.value) {
      inputValue.value = '';
    } else {
      inputValue.value = selectedItemValue.value;
    }
  }
};

const clickHandler = (e: Event) => {
  if (!e.target || !isInputItemActive.value) return;
  if (!(e.target as HTMLElement).closest(`#${inputItemId}`)) {
    if (isSelectType.value) {
      if (!selectedItemValue.value) {
        inputValue.value = '';
      } else {
        inputValue.value = selectedItemValue.value;
      }
    }
    setInputItemState();
  }
};

watch(
  () => resetInput.value,
  () => {
    if (resetInput.value) inputValue.value = '';
    resetInput.value = false;
  }
);

onMounted(() => {
  document.addEventListener('mousedown', clickHandler);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', clickHandler);
});

const setInputItemState = (state: boolean = false) => {
  isInputItemActive.value = state;
};

const selectItem = (val: string) => {
  inputValue.value = val;
  selectedItemValue.value = val;
  setInputItemState();
};
</script>

<style scoped>
.input-item {
  height: 87px;
  width: 100%;
  position: relative;
  user-select: none;
  z-index: 1;
}

.input-item.active {
  z-index: 2;
}

.label {
  position: absolute;
  top: 0;
  height: 28px;
  width: 100%;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  justify-content: space-between;
}

.label.select {
  color: #666666;
}

.label.text {
  color: #757d8a;
}

.label p::first-letter {
  text-transform: capitalize;
}

.password-visibility-switcher {
  height: 24px;
  width: 24px;
}
.password-visibility-switcher img {
  user-select: none;
  pointer-events: none;
  height: 100%;
  width: 100%;
}

div[id^='input-field'] {
  position: absolute;
  bottom: 0;
  height: 56px;
  width: 100%;
  border-radius: 12px;
}

.input {
  position: absolute;
  bottom: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: white;
  padding: 0;
  padding-left: 14px;
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  caret-color: #9cbeff;
}

.input.outlined {
  border: 1px solid #d5d5d6;
}

.active .input.outlined {
  border-color: #9cbeff;
}

.input.tonal {
  border: none;
}

.input::placeholder {
  color: #a6a3ad;
}

.dropdown-menu-wrapper {
  position: absolute;
  top: 100%;
  width: 100%;
  padding-top: 4px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.dropdown-menu {
  position: relative;
  width: 100%;
  border: 1px solid #9cbeff;
  border-radius: 5px;
  padding: 9px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: white;
}

.menu-element {
  background-color: white;
  width: 100%;
  height: 29px;
  border: none;
  padding: 0;
  border-radius: 5px;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  display: flex;
  align-items: center;
  padding-left: 5px;
}

.menu-element:not(.empty-message):hover {
  background-color: #f2f7ff;
}

input:focus-visible {
  outline: none;
}
</style>
