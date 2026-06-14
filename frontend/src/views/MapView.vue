<script setup>
import { onMounted } from 'vue';
import { useStoresStore } from '../stores/stores.store';
import StoreMap from '../components/StoreMap.vue';

const storesStore = useStoresStore();
onMounted(() => storesStore.fetchAll());
</script>

<template>
  <header class="page-head">
    <div>
      <span class="kyn-kicker">Explore</span>
      <h1 class="page-title">The Map</h1>
      <p class="page-sub">Every located place in the neighbourhood, plotted on one map.</p>
    </div>
  </header>
  <hr class="kyn-rule mb-6" />
  <StoreMap :stores="storesStore.items" />
  <p class="kyn-kicker mt-3" style="color: var(--ink-mut)">
    Showing {{ storesStore.items.filter((s) => s.latitude != null).length }}
    located place(s)
  </p>
</template>
