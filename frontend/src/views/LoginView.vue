<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { required, email as emailRule } from '../utils/rules';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);
const formRef = ref(null);
const googleBtn = ref(null);

// Only allow same-site path redirects (a single leading slash, no scheme,
// no protocol-relative `//` or `/\`) to prevent open-redirect abuse.
function redirectTarget() {
  const r = route.query.redirect;
  return typeof r === 'string' && /^\/(?![/\\])/.test(r) ? r : { name: 'stores' };
}

async function submit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push(redirectTarget());
  } catch (e) {
    error.value = e.response?.data?.error || 'Login failed';
  } finally {
    loading.value = false;
  }
}

async function handleGoogleResponse({ credential }) {
  error.value = '';
  loading.value = true;
  try {
    await auth.loginWithGoogle(credential);
    router.push(redirectTarget());
  } catch (e) {
    error.value = e.response?.data?.error || 'Google sign-in failed';
  } finally {
    loading.value = false;
  }
}

function initGoogle() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!window.google?.accounts?.id || !clientId || !googleBtn.value) return false;
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleResponse,
  });
  window.google.accounts.id.renderButton(googleBtn.value, {
    theme: 'outline',
    size: 'large',
    width: 320,
  });
  return true;
}

onMounted(() => {
  // The GIS script (loaded in index.html) may not be ready yet; poll briefly.
  if (initGoogle()) return;
  let tries = 0;
  const timer = setInterval(() => {
    if (initGoogle() || ++tries > 40) clearInterval(timer);
  }, 100);
});
</script>

<template>
  <v-row justify="center" class="mt-8">
    <v-col cols="12" sm="6" md="4">
      <v-card>
        <v-card-text class="pt-6">
          <span class="kyn-kicker">Welcome back</span>
          <h2 class="text-h4 mb-4" style="font-family: var(--sans); font-weight: 800; letter-spacing: -0.02em">
            Sign in
          </h2>
          <v-alert v-if="error" type="error" density="compact" class="mb-4">
            {{ error }}
          </v-alert>
          <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="submit">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              autocomplete="email"
              :rules="[required(), emailRule()]"
            />
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              :rules="[required()]"
              @click:append-inner="showPassword = !showPassword"
            />
            <v-btn type="submit" color="primary" block :loading="loading">Login</v-btn>
          </v-form>
          <div class="d-flex align-center my-4">
            <v-divider />
            <span class="text-caption text-medium-emphasis px-3">or</span>
            <v-divider />
          </div>
          <div ref="googleBtn" class="d-flex justify-center"></div>
          <p class="text-caption mt-4">
            No account?
            <router-link :to="{ name: 'register' }">Register</router-link>
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
