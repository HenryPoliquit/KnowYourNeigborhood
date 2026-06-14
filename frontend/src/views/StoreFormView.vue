<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStoresStore } from '../stores/stores.store';
import { useGeocode } from '../composables/useGeocode';
import StoreMap from '../components/StoreMap.vue';
import { required, phone } from '../utils/rules';

const route = useRoute();
const router = useRouter();
const storesStore = useStoresStore();
const { geocode } = useGeocode();

const isEdit = !!route.params.id;
const form = ref({ name: '', phone_number: '', locality: '', latitude: null, longitude: null });
const picked = ref(null);
const error = ref('');
const geocoding = ref(false);
const saving = ref(false);
const formRef = ref(null);

onMounted(async () => {
  if (isEdit) {
    const s = await storesStore.fetchOne(route.params.id);
    form.value = {
      name: s.name,
      phone_number: s.phone_number ?? '',
      locality: s.locality ?? '',
      latitude: s.latitude,
      longitude: s.longitude,
    };
    if (s.latitude != null && s.longitude != null) {
      picked.value = { lat: s.latitude, lng: s.longitude };
    }
  }
});

async function locate() {
  error.value = '';
  geocoding.value = true;
  try {
    const result = await geocode(form.value.locality);
    if (result) {
      picked.value = { lat: result.lat, lng: result.lng };
    } else {
      error.value = 'Could not find that locality. Click the map to place it manually.';
    }
  } finally {
    geocoding.value = false;
  }
}

// Keep form coords in sync with the picked marker.
function onPick(p) {
  picked.value = p;
}

async function submit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  error.value = '';
  saving.value = true;
  try {
    const payload = {
      name: form.value.name,
      phone_number: form.value.phone_number || null,
      locality: form.value.locality || null,
      latitude: picked.value?.lat ?? null,
      longitude: picked.value?.lng ?? null,
    };
    if (isEdit) await storesStore.update(Number(route.params.id), payload);
    else await storesStore.create(payload);
    router.push({ name: 'stores' });
  } catch (e) {
    error.value = e.response?.data?.message || e.response?.data?.error || 'Save failed';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" md="8">
      <span class="kyn-kicker">{{ isEdit ? 'Revised entry' : 'New entry' }}</span>
      <h1 class="page-title mb-1">{{ isEdit ? 'Edit a place' : 'Add a place' }}</h1>
      <p class="page-sub mb-6">Give it a name, a number, and pin it where it belongs.</p>

      <v-alert v-if="error" type="error" density="compact" class="mb-4">{{ error }}</v-alert>

      <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="submit">
        <v-text-field
          v-model="form.name"
          label="Store name"
          :rules="[required('Store name is required')]"
        />
        <v-text-field
          v-model="form.phone_number"
          label="Phone number"
          type="tel"
          :rules="[phone()]"
        />

        <div class="d-flex ga-2 align-start">
          <v-text-field
            v-model="form.locality"
            label="Locality / address"
            class="flex-grow-1"
          />
          <v-btn :loading="geocoding" color="secondary" variant="tonal" height="48" prepend-icon="mdi-map-search-outline" @click="locate">Find on map</v-btn>
        </div>

        <p class="text-caption mb-2">
          Click the map (or use “Find on map”) to set the exact location.
        </p>
        <StoreMap :pickable="true" :picked="picked" @update:picked="onPick" class="mb-4" />

        <v-btn type="submit" color="primary" :loading="saving">
          {{ isEdit ? 'Save changes' : 'Create store' }}
        </v-btn>
        <v-btn variant="text" :to="{ name: 'stores' }">Cancel</v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>
