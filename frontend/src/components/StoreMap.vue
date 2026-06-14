<script setup>
// Reusable Leaflet map.
// - markers mode: pass `stores` to plot many read-only markers (popups).
// - picker mode: pass `pickable` + v-model:picked to place/drag a single marker.
import { ref, watch, computed } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  stores: { type: Array, default: () => [] },
  pickable: { type: Boolean, default: false },
  picked: { type: Object, default: null }, // { lat, lng }
  zoom: { type: Number, default: 12 },
});
const emit = defineEmits(['update:picked']);

// Default to Singapore center; recenter on first available point.
const center = ref([1.3521, 103.8198]);

const located = computed(() =>
  props.stores.filter((s) => s.latitude != null && s.longitude != null)
);

watch(
  () => [props.picked, located.value],
  () => {
    if (props.picked) {
      center.value = [props.picked.lat, props.picked.lng];
    } else if (located.value.length) {
      center.value = [located.value[0].latitude, located.value[0].longitude];
    }
  },
  { immediate: true, deep: true }
);

function onMapClick(e) {
  if (!props.pickable) return;
  emit('update:picked', { lat: e.latlng.lat, lng: e.latlng.lng });
}
</script>

<template>
  <div style="height: 400px; width: 100%">
    <l-map
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
      @click="onMapClick"
      style="height: 100%"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      <!-- picker marker -->
      <l-marker v-if="pickable && picked" :lat-lng="[picked.lat, picked.lng]" />

      <!-- read-only store markers -->
      <l-marker
        v-for="s in located"
        :key="s.id"
        :lat-lng="[s.latitude, s.longitude]"
      >
        <l-popup>
          <strong>{{ s.name }}</strong>
          <div v-if="s.phone_number">{{ s.phone_number }}</div>
          <div v-if="s.locality" class="text-caption">{{ s.locality }}</div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>
