<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStoresStore } from '../stores/stores.store';
import { useAuthStore } from '../stores/auth.store';

const storesStore = useStoresStore();
const auth = useAuthStore();
const router = useRouter();

const snackbar = ref({ show: false, text: '' });
const confirm = ref({ show: false, id: null });

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Phone', key: 'phone_number' },
  { title: 'Locality', key: 'locality' },
  { title: '', key: 'actions', sortable: false, align: 'end' },
];

onMounted(() => storesStore.fetchAll());

function edit(id) {
  router.push({ name: 'store-edit', params: { id } });
}

function askDelete(id) {
  confirm.value = { show: true, id };
}

async function doDelete() {
  await storesStore.remove(confirm.value.id);
  confirm.value = { show: false, id: null };
  snackbar.value = { show: true, text: 'Store deleted' };
}
</script>

<template>
  <header class="page-head">
    <div>
      <span class="kyn-kicker">Browse</span>
      <h1 class="page-title">The Directory</h1>
      <p class="page-sub">Every place on record — names, numbers and neighbourhoods, all in one list.</p>
    </div>
    <v-btn v-if="auth.isAuthenticated" color="primary" :to="{ name: 'store-new' }">
      + Add a place
    </v-btn>
  </header>
  <hr class="kyn-rule mb-6" />

  <v-data-table
    :headers="headers"
    :items="storesStore.items"
    :loading="storesStore.loading"
    no-data-text="No stores yet"
  >
    <template #item.actions="{ item }">
      <template v-if="auth.isAuthenticated">
        <v-btn icon="mdi-pencil" variant="text" size="small" @click="edit(item.id)" />
        <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="askDelete(item.id)" />
      </template>
    </template>
  </v-data-table>

  <v-dialog v-model="confirm.show" max-width="400">
    <v-card>
      <v-card-title>Delete store?</v-card-title>
      <v-card-text>This cannot be undone.</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="confirm.show = false">Cancel</v-btn>
        <v-btn color="error" @click="doDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show">{{ snackbar.text }}</v-snackbar>
</template>
