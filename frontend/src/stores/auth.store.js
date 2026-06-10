import { defineStore } from 'pinia';
import client from '../api/client';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    restore() {
      this.token = localStorage.getItem('kyn_token');
      const raw = localStorage.getItem('kyn_user');
      this.user = raw ? JSON.parse(raw) : null;
    },
    persist() {
      if (this.token) localStorage.setItem('kyn_token', this.token);
      else localStorage.removeItem('kyn_token');
      if (this.user) localStorage.setItem('kyn_user', JSON.stringify(this.user));
      else localStorage.removeItem('kyn_user');
    },
    async login(email, password) {
      const { data } = await client.post('/api/auth/login', { email, password });
      this.token = data.token;
      this.user = data.user;
      this.persist();
    },
    async register(email, password, name) {
      const { data } = await client.post('/api/auth/register', { email, password, name });
      this.token = data.token;
      this.user = data.user;
      this.persist();
    },
    async loginWithGoogle(credential) {
      const { data } = await client.post('/api/auth/google', { credential });
      this.token = data.token;
      this.user = data.user;
      this.persist();
    },
    logout() {
      this.token = null;
      this.user = null;
      this.persist();
    },
  },
});
