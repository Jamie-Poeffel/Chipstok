<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFetch } from '@/composables/useFetch';
import { Loader2 } from 'lucide-vue-next';
import { useLanguage } from '@/composables/useLanguage';

const { selectedLanguage, setLanguage, languages, t } = useLanguage();
const router = useRouter();
const route = useRoute();

const username = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref({ username: '', password: '' });
const showLanguageModal = ref(!selectedLanguage.value);

const login = async () => {
  errors.value = { username: '', password: '' };

  if (!username.value) errors.value.username = t('errors.usernameRequired');
  if (!password.value) errors.value.password = t('errors.passwordRequired');

  if (username.value && password.value) {
    loading.value = true;
    try {
      const { res, data } = await useFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username.value, password: password.value }),
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/');
      } else {
        errors.value.username = data.message || 'Invalid login credentials';
      }
    } catch {
      errors.value.username = 'An error occurred. Please try again.';
    } finally {
      loading.value = false;
    }
  }
};

onMounted(() => {
  if (!selectedLanguage.value) {
    showLanguageModal.value = true;
  }
});
</script>

<template>
  <div
    class="flex justify-center items-center h-full bg-gradient-to-b from-indigo-300 via-blue-400 to-[#0080D1] relative overflow-hidden"
  >
    <div
      class="w-96 p-8 bg-white border border-gray-300 rounded-xl shadow-lg text-center relative z-10"
    >
      <h1 class="text-3xl font-extrabold mb-6 text-gray-800">{{ t('title') }}</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input
            v-model="username"
            type="text"
            :placeholder="t('placeholderPhone')"
            class="input"
          />
          <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
        </div>
        <div>
          <input v-model="password" type="password" :placeholder="t('password')" class="input" />
          <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
        </div>
        <button type="submit" class="button">
          <div v-if="!loading">{{ t('login') }}</div>
          <div v-else class="flex justify-center items-center">
            <Loader2 class="animate-spin w-4 h-4" />
          </div>
        </button>
      </form>
      <div class="mt-4 text-sm text-gray-500">
        <a href="#" class="text-blue-500 hover:underline">{{ t('forgotPassword') }}</a>
      </div>
      <div class="mt-6 border-t pt-4 text-sm text-gray-700">
        {{ t('noAccount') }}
        <a href="/signup" class="text-blue-500 font-bold">{{ t('signup') }}</a>
      </div>
    </div>

    <!-- Language Modal -->
    <div
      v-if="showLanguageModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
        <h2 class="text-lg font-bold mb-4">{{ t('chooseLanguage') }}</h2>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="(lang, code) in languages"
            :key="code"
            @click="
              setLanguage(code);
              showLanguageModal = false;
            "
            class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {{ code.toUpperCase() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f3f4f6;
  outline: none;
}
.button {
  width: 100%;
  background-color: #3b82f6;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s;
}
.button:hover {
  background-color: #2563eb;
  transform: scale(1.05);
}
</style>
