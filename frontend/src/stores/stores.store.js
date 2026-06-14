import { defineStore } from 'pinia';
import client from '../api/client';

export const useStoresStore = defineStore('stores', {
  state: () => ({
    items: [],
    loading: false,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const { data } = await client.get('/api/stores');
        this.items = data;
      } finally {
        this.loading = false;
      }
    },
    async fetchOne(id) {
      const { data } = await client.get(`/api/stores/${id}`);
      return data;
    },
    async create(payload) {
      const { data } = await client.post('/api/stores', payload);
      this.items.unshift(data);
      return data;
    },
    async update(id, payload) {
      const { data } = await client.put(`/api/stores/${id}`, payload);
      const idx = this.items.findIndex((s) => s.id === id);
      if (idx !== -1) this.items[idx] = data;
      return data;
    },
    async remove(id) {
      await client.delete(`/api/stores/${id}`);
      this.items = this.items.filter((s) => s.id !== id);
    },
  },
});
