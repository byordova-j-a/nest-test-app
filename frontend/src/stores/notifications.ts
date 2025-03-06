import { defineStore } from 'pinia';

type TNotificationsStore = {
  notificationList: { message: string }[];
};

export const useNotificationsStore = defineStore('notifications', {
  state: (): TNotificationsStore => {
    return {
      notificationList: [],
    };
  },
  getters: {
    getCurrentNotification: state => state.notificationList[0],
  },
  actions: {
    addNotification(message: string) {
      this.notificationList.push({ message });
    },
    removeCurrentNotification() {
      this.notificationList.shift();
    },
  },
});
