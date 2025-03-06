import { defineStore } from 'pinia';
import { useNotificationsStore } from './notifications';

export const DEFAULT_ERROR_MESSAGE = 'unexpected error';

export const getErrorMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : DEFAULT_ERROR_MESSAGE;
};

type TUser = { id: number; login: string; tabel: string };
type TOption = { id: number; value: string };

type TUsersStore = {
  currentUser: null | TUser;
  loginList: TOption[];
  tabelList: TOption[];
};

type TLoginParams = {
  login: string;
  tabel: string;
  password: string;
  isAccountSaved: boolean;
};

export const useUsersStore = defineStore('users', {
  state: (): TUsersStore => {
    return {
      currentUser: null,
      loginList: [],
      tabelList: [],
    };
  },
  getters: {
    getUser: state => state.currentUser,
    getLoginList: state => state.loginList,
    getTabelList: state => state.tabelList,
  },
  actions: {
    async login(params: TLoginParams) {
      const { isAccountSaved, login, tabel, password } = params;
      const { addNotification } = useNotificationsStore();
      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ login, tabel, password }),
        });
        if (!response.ok) {
          throw new Error('Нет пользователя с такими данными');
        }

        await this.fetchUser();
        if (isAccountSaved) {
          const userList = [];
          const localStorageData = localStorage.getItem('userList');
          const currentUser = this.getUser;
          if (currentUser) {
            userList.push({ login, tabel, id: currentUser.id });
          }
          if (localStorageData) {
            const localStorageItems = currentUser
              ? JSON.parse(localStorageData).filter(
                  ({ login }: { login: string }) => currentUser.login !== login
                )
              : JSON.parse(localStorageData);
            userList.push(...localStorageItems);
          }
          localStorage.setItem('userList', JSON.stringify(userList));
        }
      } catch (err) {
        addNotification(getErrorMessage(err));
      }
    },
    async logout() {
      const { addNotification } = useNotificationsStore();
      try {
        const response = await fetch('http://localhost:3000/auth/delete', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка выхода');
        }
        this.currentUser = null;
      } catch (err) {
        addNotification(getErrorMessage(err));
      }
    },
    async fetchUser() {
      const { addNotification } = useNotificationsStore();
      try {
        const response = await fetch('http://localhost:3000/auth/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        });
        if (!response.ok) {
          throw new Error('Пользователь не авторизован');
        }

        const user: TUser = await response.json();
        this.currentUser = user;
      } catch (err) {
        addNotification(getErrorMessage(err));
      }
    },

    async fetchLoginList() {
      const { addNotification } = useNotificationsStore();
      try {
        const response = await fetch('http://localhost:3000/users/logins', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        });
        if (!response.ok) {
          throw new Error('Логины не найдены');
        }

        const logins: TOption[] = await response.json();
        this.loginList = logins;
      } catch (err) {
        addNotification(getErrorMessage(err));
      }
    },

    async fetchTabelNumberList() {
      const { addNotification } = useNotificationsStore();
      try {
        const response = await fetch('http://localhost:3000/users/tabels', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        });
        if (!response.ok) {
          throw new Error('Табельные номеры не найдены');
        }

        const tabels: TOption[] = await response.json();
        this.tabelList = tabels;
      } catch (err) {
        addNotification(getErrorMessage(err));
      }
    },
  },
});
