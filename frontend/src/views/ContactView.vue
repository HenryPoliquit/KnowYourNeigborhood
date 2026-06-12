<script setup>
import { ref } from 'vue';
import client from '../api/client';
import { required, email as emailRule } from '../utils/rules';

const name = ref('');
const email = ref('');
const body = ref('');
const error = ref('');
const sending = ref(false);
const snackbar = ref(false);
const formRef = ref(null);

async function submit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  error.value = '';
  sending.value = true;
  try {
    await client.post('/api/messages', {
      name: name.value || null,
      email: email.value || null,
      body: body.value,
    });
    name.value = '';
    email.value = '';
    body.value = '';
    snackbar.value = true;
  } catch (e) {
    error.value = e.response?.data?.message || e.response?.data?.error || 'Failed to send';
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <v-row justify="center" class="mt-4">
    <v-col cols="12" md="7">
      <span class="kyn-kicker">Get in touch</span>
      <h1 class="page-title mb-1">Say hello</h1>
      <p class="page-sub mb-6">Found something we missed? Drop us a line — we read every one.</p>
      <v-alert v-if="error" type="error" density="compact" class="mb-4">{{ error }}</v-alert>
      <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="submit">
        <v-text-field
          v-model="name"
          label="Your name"
          autocomplete="name"
        />
        <v-text-field
          v-model="email"
          label="Your email"
          type="email"
          autocomplete="email"
          :rules="[emailRule()]"
        />
        <v-textarea
          v-model="body"
          label="Message"
          rows="4"
          auto-grow
          counter
          :rules="[required()]"
        />
        <v-btn type="submit" color="primary" :loading="sending">Send</v-btn>
      </v-form>
      <v-snackbar v-model="snackbar">Message sent — thanks!</v-snackbar>
    </v-col>
  </v-row>
</template>
