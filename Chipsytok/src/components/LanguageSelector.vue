<script setup>
import { useLanguage } from '@/composables/useLanguage';

const { languages, setLanguage, getEnglishName } = useLanguage();
</script>

<template>
  <!-- centred row -->
  <div class="lang-picker">
    <div v-for="(_, code) in languages" :key="code" class="lang-wrapper">
      <!-- square button -->
      <button @click="setLanguage(code)" class="lang-btn">
        {{ code }}
      </button>

      <!-- English name (hidden until hover) -->
      <span class="lang-label">
        {{ getEnglishName(code) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* layout */
.lang-picker {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}
.lang-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* square */
.lang-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* label: starts hidden */
.lang-label {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #374151; /* gray‑700 */
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  pointer-events: none; /* don’t steal hover */
}

/* show on hover */
.lang-wrapper:hover .lang-label {
  opacity: 1;
  transform: translateY(0);
}
</style>
