<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch } from '@/composables/useFetch';
import { Loader2, Globe } from 'lucide-vue-next';
import { useLanguage } from '@/composables/useLanguage';
import { Eye, EyeOff } from 'lucide-vue-next';

const { selectedLanguage, setLanguage, languages, t } = useLanguage();
const router = useRouter();

const firstname = ref('');
const lastname = ref('');
const phonePrefix = ref('');
const phoneNumber = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const testpassword = ref('');
const showPassword = ref(false);

const verificationCode = ref('');
const verificationFailed = ref(false);
const showVerification = ref(false);

const showLanguageModal = ref(!selectedLanguage.value);
const loading = ref(false);
const errors = ref({ username: '', email: '', password: '' });

const countryPrefixes = computed(() => languages[selectedLanguage.value || 'en'].countries);
const sortedCountryPrefixes = computed(() =>
  Object.fromEntries(
    Object.entries(countryPrefixes.value).sort(([, a], [, b]) => a.localeCompare(b)),
  ),
);

const signup = async () => {
  errors.value = { username: '', email: '', password: '' };

  if (!username.value) errors.value.username = t('errors.usernameRequired');
  if (!email.value) errors.value.email = t('errors.emailRequired');
  if (!password.value) errors.value.password = t('errors.passwordRequired');
  if (password.value && password.value !== testpassword.value) {
    errors.value.password = t('errors.passwordsMismatch');
  }

  if (username.value && email.value && password.value && password.value === testpassword.value) {
    loading.value = true;
    try {
      await useFetch('/users/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: firstname.value,
          lastname: lastname.value,
          phone: phonePrefix.value + phoneNumber.value,
          email: email.value,
          username: username.value,
          password: password.value,
        }),
        credentials: 'include',
      });

      await useFetch(
        `/auth/2fa`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value }),
          credentials: 'include',
        },
      );
      showVerification.value = true;
    } catch {
      errors.value.username = 'An error occurred. Please try again.';
    } finally {
      loading.value = false;
    }
  }
};

const verifyCode = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/2fa`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, code: verificationCode.value }),
      credentials: 'include',
    },
  );
  if (res.ok) {
    router.push('/login');
  } else {
    verificationFailed.value = true;
    setTimeout(() => {
      verificationFailed.value = false;
      showVerification.value = false;
    }, 3000);
  }
};

onMounted(() => {
  if (!selectedLanguage.value) showLanguageModal.value = true;
});
</script>

<template>
  <div
    class="flex justify-center items-center h-full bg-gradient-to-b from-indigo-300 via-blue-400 to-[#0080D1] relative overflow-hidden">
    <div class="w-96 p-8 bg-white border border-gray-300 rounded-xl shadow-lg text-center relative z-10">
      <h1 class="text-3xl font-extrabold mb-6 text-gray-800">{{ t('title') }}</h1>

      <form @submit.prevent="signup" class="space-y-4">
        <input v-model="firstname" type="text" :placeholder="t('firstName')" class="input" />
        <input v-model="lastname" type="text" :placeholder="t('lastName')" class="input" />

        <div class="flex gap-2">
          <div class="relative w-1/4">
            <input list="prefixes" v-model="phonePrefix" placeholder="+ ..." class="input font-mono pr-8"
              autocomplete="off" />
            <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"></div>
            <datalist id="prefixes">
              <option v-for="(name, code) in sortedCountryPrefixes" :key="code" :value="code">
                {{ name }}
              </option>
            </datalist>
          </div>
          <input v-model="phoneNumber" type="tel" :placeholder="t('phoneNumber')" class="w-3/4 input" />
        </div>

        <input v-model="email" type="email" :placeholder="t('email')" class="input" />
        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>

        <input v-model="username" type="text" :placeholder="t('username')" class="input" />
        <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>

        <div class="relative">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" :placeholder="t('password')"
            class="input pr-10" />
          <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            @click="showPassword = !showPassword">
            <component :is="showPassword ? EyeOff : Eye" />

          </button>
        </div>

        <div class="relative">
          <input v-model="testpassword" :type="showPassword ? 'text' : 'password'" :placeholder="t('confirmPassword')"
            class="input pr-10" />
          <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            @click="showPassword = !showPassword">
            <component :is="showPassword ? 'lucide-eye-off' : 'lucide-eye'" class="w-5 h-5" />
          </button>
        </div>

        <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>

        <button type="submit" class="button">
          <div v-if="!loading">{{ t('signup') }}</div>
          <div v-else class="flex justify-center items-center">
            <Loader2 class="animate-spin w-4 h-4" />
          </div>
        </button>
      </form>

      <div class="mt-6 border-t pt-4 text-sm text-gray-700">
        {{ t('haveAccount') }} <a href="/login" class="text-blue-500 font-bold">{{ t('login') }}</a>
      </div>

      <button @click="showLanguageModal = true" aria-label="Choose language"
        class="mt-4 mx-auto block text-gray-500 hover:text-gray-700">
        <Globe class="w-6 h-6" />
      </button>
    </div>

    <div v-if="showVerification" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
        <h2 class="text-lg font-semibold mb-4">{{ t('verificationTitle') }}</h2>
        <input v-model="verificationCode" maxlength="5"
          class="w-full text-center text-lg tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="_ _ _ _ _" />
        <p v-if="verificationFailed" class="text-red-500 text-sm mt-2">
          {{ t('verificationFailed') }}
        </p>
        <button class="mt-4 w-full py-2 rounded-lg font-bold text-white transition-all" :class="verificationCode.length === 5
          ? 'bg-blue-500 hover:bg-blue-600'
          : 'bg-gray-400 cursor-not-allowed'
          " :disabled="verificationCode.length !== 5" @click="verifyCode">
          {{ t('verify') }}
        </button>
      </div>
    </div>

    <div v-if="showLanguageModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      @click.self="showLanguageModal = false">
      <div class="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
        <h2 class="text-lg font-bold mb-4">{{ t('chooseLanguage') }}</h2>
        <div class="flex flex-wrap justify-center gap-2">
          <button v-for="(_, code) in languages" :key="code" @click="
            setLanguage(code);
          showLanguageModal = false;
          " class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 uppercase">
            {{ code }}
          </button>
        </div>
      </div>
      <div>
        <button @click="showLanguageModal = true" aria-label="Choose language"
          class="mt-4 mx-auto block text-gray-500 hover:text-gray-700"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input::-webkit-calendar-picker-indicator {
  display: none !important;
  appearance: none;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f3f4f6;
  outline: none;
  appearance: none;
  font-family: inherit;
  max-height: 150px;
  overflow-y: auto;
}

select.input {
  font-family: monospace;
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
