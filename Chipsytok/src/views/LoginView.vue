<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch } from '@/composables/useFetch';
import { Loader2, Globe, MailCheck } from 'lucide-vue-next';
import { useLanguage } from '@/composables/useLanguage';

const { setLanguage, languages, t, getEnglishName, selectedLanguage } = useLanguage();
const hoveredLang = ref(getEnglishName(selectedLanguage.value || 'en'));

const router = useRouter();
const username = ref(''); // email or phone number entered by the user
const password = ref('');

// forgot‑password flow refs
const forgotEmail = ref('');

const loading = ref(false);
const errors = ref({ username: '', password: '' });
const forgotError = ref('');

const showLanguageModal = ref(false);
const showForgotRequestModal = ref(false); // asks for e‑mail
const showForgotSuccessToast = ref(false); // final confirmation pop‑up

/**
 * Log the user in as before
 */
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
      errors.value.username = t('errors.generalError');
    } finally {
      loading.value = false;
    }
  }
};

/**
 * Open the modal that asks the user for the e‑mail to reset
 */
const openForgotPasswordModal = () => {
  forgotEmail.value = '';
  forgotError.value = '';
  showForgotRequestModal.value = true;
};

/**
 * POST /auth/forgot-password and show success pop‑up
 */
const sendResetEmail = async () => {
  forgotError.value = '';
  if (!forgotEmail.value) {
    forgotError.value = t('errors.emailRequired') || 'E‑mail required';
    return;
  }

  try {
    await useFetch('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail.value.trim() }),
      credentials: 'include',
    });
  } catch (error) {
    // handle error (e.g., show a message to the user)
    forgotError.value = error.message || 'An error occurred. Please try again.';
    console.error('Error sending reset email:', error);
    /* optional logging – UI still shows success for privacy */
  } finally {
    showForgotRequestModal.value = false;
    showForgotSuccessToast.value = true;
    // auto‑hide pop‑up after 5 s
    setTimeout(() => (showForgotSuccessToast.value = false), 5000);
  }
};
</script>

<template>
  <!-- outer container -->
  <div
    class="flex justify-center items-center h-full bg-gradient-to-b from-indigo-300 via-blue-400 to-[#0080D1] relative overflow-hidden"
  >
    <!-- login card -->
    <div
      class="w-96 p-8 bg-white border border-gray-300 rounded-xl shadow-lg text-center relative z-10"
    >
      <h1 class="text-3xl font-extrabold mb-6 text-gray-800">{{ t('title') }}</h1>

      <form @submit.prevent="login" class="space-y-4">
        <!-- username -->
        <div>
          <input
            v-model="username"
            type="text"
            :placeholder="t('placeholderPhone')"
            class="input"
          />
          <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
        </div>

        <!-- password -->
        <div>
          <input v-model="password" type="password" :placeholder="t('password')" class="input" />
          <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
        </div>

        <!-- submit -->
        <button type="submit" class="button">
          <div v-if="!loading">{{ t('login') }}</div>
          <div v-else class="flex justify-center items-center">
            <Loader2 class="animate-spin w-4 h-4" />
          </div>
        </button>
      </form>

      <!-- forgot password link -->
      <div class="mt-4 text-sm text-gray-500">
        <a href="#" @click.prevent="openForgotPasswordModal" class="text-blue-500 hover:underline">
          {{ t('forgotPassword') }}
        </a>
      </div>

      <!-- sign‑up row -->
      <div class="mt-6 border-t pt-4 text-sm text-gray-700">
        {{ t('noAccount') }}
        <a href="/signup" class="text-blue-500 font-bold">{{ t('signup') }}</a>
      </div>

      <!-- globe icon (language picker) -->
      <button
        @click="showLanguageModal = true"
        aria-label="Choose language"
        class="mt-4 mx-auto block text-gray-500 hover:text-gray-700"
      >
        <Globe class="w-6 h-6" />
      </button>
    </div>

    <!-- language modal -->
    <div
      v-if="showLanguageModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
        <h2 class="text-lg font-bold mb-4">{{ t('chooseLanguage') }}</h2>
        <div class="flex flex-col items-center">
          <!-- Language buttons (row) -->
          <div class="flex gap-3">
            <button
              v-for="(_, code) in languages"
              :key="code"
              @click="
                setLanguage(code);
                showLanguageModal = false;
              "
              @mouseover="hoveredLang = getEnglishName(code)"
              @mouseleave="hoveredLang = getEnglishName(selectedLanguage.value)"
              class="w-10 h-10 bg-blue-500 text-white rounded font-semibold uppercase hover:bg-blue-600"
            >
              {{ code }}
            </button>
          </div>

          <!-- Label below buttons -->
          <div class="mt-2 text-sm text-gray-700 font-medium min-h-[1.5rem]">
            {{ hoveredLang }}
          </div>
        </div>
      </div>
    </div>

    <!-- forgot‑password request modal -->
    <div
      v-if="showForgotRequestModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
        <h2 class="text-lg font-bold mb-4">{{ t('resetPassword') }}</h2>
        <input
          v-model="forgotEmail"
          type="email"
          :placeholder="t('Your Email')"
          class="input mb-3"
        />
        <p v-if="forgotError" class="text-red-500 text-sm mb-3">{{ forgotError }}</p>

        <div class="flex justify-center gap-2 mt-2">
          <button
            @click="showForgotRequestModal = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            {{ t('Cancel') }}
          </button>
          <button
            @click="sendResetEmail"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {{ t('Send') }}
          </button>
        </div>
      </div>
    </div>

    <!-- success pop‑up (center of screen) -->
    <div v-if="showForgotSuccessToast" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- semi‑transparent backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <div
        class="relative bg-white border border-green-500 rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center flex flex-col items-center"
      >
        <MailCheck class="w-10 h-10 text-green-500 mb-4" />
        <h2 class="text-lg font-bold mb-2">{{ t("Don't get scared") }}</h2>
        <p class="text-gray-700 mb-4">
          {{ t('You will soon be connected again') }} <br />
          <span class="font-semibold break-words">{{ forgotEmail }}</span>
        </p>
        <button
          @click="showForgotSuccessToast = false"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ t('Ok') }}
        </button>
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
