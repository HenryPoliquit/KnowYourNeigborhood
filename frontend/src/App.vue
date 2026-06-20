<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth.store';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const nav = [
  { label: 'Directory', to: { name: 'stores' } },
  { label: 'The Map', to: { name: 'map' } },
  { label: 'Letters', to: { name: 'contact' } },
];

const isActive = (name) => route.name === name;

function logout() {
  auth.logout();
  router.push({ name: 'home' });
}
</script>

<template>
  <v-app>
    <v-app-bar :height="92" flat>
      <div class="masthead">
        <div class="masthead__brand" @click="router.push('/')">
          <span class="masthead__mark" aria-hidden="true">
            <img src="/logo.svg" alt="" width="28" height="28" />
          </span>
          <span class="masthead__brandtext">
            <span class="masthead__title">Know Your Neighbourhood</span>
            <span class="masthead__tag">Discover your local area</span>
          </span>
        </div>

        <nav class="masthead__nav">
          <router-link
            v-for="item in nav"
            :key="item.label"
            :to="item.to"
            class="masthead__link"
            :class="{ 'masthead__link--on': isActive(item.to.name) }"
          >{{ item.label }}</router-link>
        </nav>

        <div class="masthead__actions">
          <template v-if="auth.isAuthenticated">
            <v-btn color="primary" size="small" :to="{ name: 'store-new' }">+ Add a place</v-btn>
            <span class="masthead__byline">— {{ auth.user?.name || auth.user?.email }}</span>
            <v-btn variant="text" size="small" @click="logout">Sign out</v-btn>
          </template>
          <template v-else>
            <v-btn variant="text" size="small" :to="{ name: 'login' }">Sign in</v-btn>
            <v-btn color="primary" size="small" :to="{ name: 'register' }">Join</v-btn>
          </template>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <v-container class="py-8">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <div :key="route.path" class="page-wrap">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.masthead {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 clamp(1rem, 4vw, 3rem);
}
.masthead__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
}
.masthead__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--paper-2);
  box-shadow: var(--shadow-sm);
  flex: none;
}
.masthead__brandtext {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}
.masthead__title {
  font-family: var(--sans);
  font-weight: 800;
  font-size: clamp(1.05rem, 2vw, 1.45rem);
  letter-spacing: -0.02em;
}
.masthead__tag {
  font-family: var(--sans);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--ink-mut);
  margin-top: 2px;
}
.masthead__nav {
  display: flex;
  gap: 0.4rem;
  margin-left: auto;
}
.masthead__link {
  font-family: var(--sans);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 999px;
  transition: background 0.15s ease, color 0.15s ease;
}
.masthead__link:hover { color: var(--coral-d); background: var(--paper-2); }
.masthead__link--on {
  color: var(--coral-d);
  background: rgba(232, 116, 91, 0.12);
}
.masthead__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.masthead__byline {
  font-family: var(--sans);
  font-size: 0.85rem;
  color: var(--ink-mut);
}

/* hide the nav on small screens, keep brand + actions */
@media (max-width: 860px) {
  .masthead__nav { display: none; }
}

/* page transition */
.page-enter-active,
.page-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
