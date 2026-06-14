<script setup>
import { onMounted, computed } from 'vue';
import { useStoresStore } from '../stores/stores.store';

const storesStore = useStoresStore();
onMounted(() => { if (!storesStore.items.length) storesStore.fetchAll(); });

const count = computed(() => storesStore.items.length);
const located = computed(
  () => storesStore.items.filter((s) => s.latitude != null).length
);
</script>

<template>
  <section class="hero">
    <div class="hero__head">
      <span class="kyn-kicker">The community pages</span>
      <h1 class="hero__title">
        Every corner<br />
        has a <em class="hero__em">story</em>.
      </h1>
      <p class="hero__lede">
        A field guide to the shops, stalls and small wonders around you —
        gathered by the people who actually live here.
      </p>
      <div class="hero__cta">
        <v-btn color="primary" size="large" :to="{ name: 'stores' }">Read the directory</v-btn>
        <v-btn color="secondary" size="large" :to="{ name: 'map' }">Open the map</v-btn>
      </div>
    </div>

    <aside class="hero__plate">
      <div class="plate">
        <div class="plate__row">
          <span class="plate__num">{{ count }}</span>
          <span class="plate__lbl">places<br />on record</span>
        </div>
        <hr class="kyn-rule" />
        <div class="plate__row">
          <span class="plate__num plate__num--blue">{{ located }}</span>
          <span class="plate__lbl">pinned<br />on the map</span>
        </div>
        <hr class="kyn-rule" />
        <p class="plate__foot">
          “The whole point of a neighbourhood is that you can't read it from
          a screen.” — but this helps.
        </p>
      </div>
    </aside>
  </section>

  <hr class="kyn-rule mt-10 mb-8" />

  <section class="cols">
    <article class="col">
      <span class="kyn-tag">01 — Browse</span>
      <h3 class="col__h">Find what's nearby</h3>
      <p class="col__p">Browse a friendly directory of local places, with
        names, numbers and neighbourhoods.</p>
    </article>
    <article class="col">
      <span class="kyn-tag">02 — Contribute</span>
      <h3 class="col__h">Add your favourites</h3>
      <p class="col__p">Sign in, drop a pin on the map, and put the spots you
        love on the record for everyone else.</p>
    </article>
    <article class="col">
      <span class="kyn-tag">03 — Explore</span>
      <h3 class="col__h">See the whole map</h3>
      <p class="col__p">Every located place, plotted on one clear, friendly
        map of the neighbourhood.</p>
    </article>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
}
.hero__title {
  font-family: var(--sans);
  font-weight: 800;
  font-size: clamp(2.6rem, 7vw, 5.4rem);
  letter-spacing: -0.03em;
  line-height: 1.02;
  margin: 0.4rem 0 1.2rem;
}
.hero__em {
  color: var(--coral);
}
.hero__lede {
  font-family: var(--sans);
  font-size: clamp(1.02rem, 1.4vw, 1.25rem);
  max-width: 38ch;
  color: var(--ink-mut);
  line-height: 1.6;
  margin-bottom: 1.8rem;
}
.hero__cta { display: flex; gap: 0.8rem; flex-wrap: wrap; }

/* stat plate, a clean soft card */
.hero__plate { display: flex; justify-content: flex-end; }
.plate {
  background: var(--paper-card);
  border: var(--edge);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.6rem 1.7rem;
  width: 100%;
  max-width: 340px;
}
.plate__row { display: flex; align-items: center; gap: 1rem; padding: 0.7rem 0; }
.plate__num {
  font-family: var(--sans);
  font-weight: 800;
  font-size: 3.2rem;
  line-height: 1;
  color: var(--coral);
  letter-spacing: -0.02em;
}
.plate__num--blue { color: var(--sage-d); }
.plate__lbl {
  font-family: var(--sans);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 0.72rem;
  line-height: 1.35;
  color: var(--ink-mut);
}
.plate__foot {
  font-family: var(--sans);
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--ink-mut);
  margin-top: 0.7rem;
}

.cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1rem, 3vw, 1.6rem);
}
.col {
  background: var(--paper-card);
  border: var(--edge);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 1.4rem 1.4rem 1.5rem;
}
.col__h {
  font-family: var(--sans);
  font-weight: 800;
  font-size: 1.3rem;
  letter-spacing: -0.01em;
  margin: 0.8rem 0 0.4rem;
}
.col__p { font-family: var(--sans); line-height: 1.55; color: var(--ink-mut); }

@media (max-width: 820px) {
  .hero { grid-template-columns: 1fr; align-items: start; }
  .hero__plate { justify-content: flex-start; }
  .cols { grid-template-columns: 1fr; }
}
</style>
