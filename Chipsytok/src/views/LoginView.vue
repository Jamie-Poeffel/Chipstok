<template>
  <div
    class="flex justify-center items-center h-full bg-gradient-to-b from-indigo-300 via-blue-400 to-[#0080D1] relative overflow-hidden"
  >
    <div
      class="w-96 p-8 bg-white border border-gray-300 rounded-xl shadow-lg text-center relative z-10"
    >
      <h1 class="text-3xl font-extrabold mb-6 text-gray-800">ChipsTok</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input
            v-model="username"
            type="text"
            id="UWD"
            name="Username"
            autocomplete="username"
            placeholder="Phone number, username, or email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            id="PWD"
            name="Password"
            autocomplete="current-password"
            placeholder="Password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-600"
        >
          <div v-if="!loading">Log in</div>
          <div v-else class="flex justify-center items-center">
            <Loader2 class="animate-spin w-4 h-4" />
          </div>
        </button>
      </form>
      <div class="mt-4 text-sm text-gray-500">
        <a
          href="#"
          @click.prevent="showForgotPasswordModal = true"
          class="text-blue-500 hover:underline"
        >
          Forgot password?
        </a>
      </div>
      <div class="mt-6 border-t pt-4 text-sm text-gray-700">
        Don't have an account? <a href="/signup" class="text-blue-500 font-bold">Sign up</a>
      </div>

      <!-- New Colab Button -->
      <div class="mt-6">
        <a
          href="https://www.youtube.com/watch?v=g0M04BXQCFI"
          target="_blank"
          class="flex items-center justify-center w-full border border-[#00aff0] text-white py-1 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:border-[#0093cc] space-x-3"
        >
          <img
            src="/ChipslyFans.jpg"
            alt="ChipslyFans"
            class="w-8 h-8 -translate-x-2 rounded-full transition-all duration-300"
          />
          <span class="text-[#00aff0] -translate-x-3"> ChipslyFans </span>
        </a>
      </div>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div
    v-if="showForgotPasswordModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
      <h2 class="text-lg font-bold mb-4">Reset your password</h2>
      <p class="text-gray-600 mb-4">Choose how you want to reset your password:</p>

      <div class="flex justify-center space-x-4 mb-4">
        <button
          @click="selectedMethod = 'email'"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Via Email
        </button>
        <button
          @click="selectedMethod = 'username'"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Via Username
        </button>
      </div>

      <div v-if="selectedMethod === 'email'" class="space-y-2">
        <input
          v-model="emailInput"
          type="email"
          placeholder="Enter your email"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
        />
      </div>

      <div v-if="selectedMethod === 'username'" class="space-y-2">
        <input
          v-model="usernameInput"
          type="text"
          placeholder="Enter your username"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
        />
      </div>

      <div class="mt-4 flex justify-between">
        <button
          @click="sendResetLink"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 w-full mr-2"
        >
          Send Reset Link
        </button>
        <button
          @click="closeForgotPasswordModal"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 w-full ml-2"
        >
          Cancel
        </button>
      </div>

      <p v-if="forgotPasswordError" class="text-red-500 text-sm mt-2">{{ forgotPasswordError }}</p>
    </div>
  </div>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { useFetch } from '@/composables/useFetch';
import { useRouter, useRoute } from 'vue-router';

const username = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref({ username: '', password: '' });
const router = useRouter();
const route = useRoute();

const login = async () => {
  errors.value = { username: '', password: '' };

  if (!username.value) errors.value.username = 'Username is required';
  if (!password.value) errors.value.password = 'Password is required';

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
        if (route.query.state === 'authorize') {
          const redirect_uri = route.query.redirect_uri;
          const state = route.query.state;
          const { res, data } = await useFetch('/auth/auto', { credentials: 'include' });
          if (res.ok) {
            window.location.href = `${redirect_uri}?code=${data.token}&state=${state}`;
          } else {
            window.location.href = `${import.meta.env.VITE_BASE_URL}/login?client_id=${route.query.client_id}&redirect_uri=${redirect_uri}&state=authorize`;
          }
        } else {
          router.push('/');
        }
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

const showForgotPasswordModal = ref(false);
const selectedMethod = ref('');
const emailInput = ref('');
const usernameInput = ref('');
const forgotPasswordError = ref('');

const closeForgotPasswordModal = () => {
  showForgotPasswordModal.value = false;
  selectedMethod.value = '';
  emailInput.value = '';
  usernameInput.value = '';
  forgotPasswordError.value = '';
};

const sendResetLink = async () => {
  forgotPasswordError.value = '';
  if (selectedMethod.value === 'email' && !emailInput.value) {
    forgotPasswordError.value = 'Please enter your email.';
    return;
  }
  if (selectedMethod.value === 'username' && !usernameInput.value) {
    forgotPasswordError.value = 'Please enter your username.';
    return;
  }
  try {
    const body =
      selectedMethod.value === 'email'
        ? { email: emailInput.value }
        : { username: usernameInput.value };
    const { res, data } = await useFetch('/auth/request-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      alert('A password reset link has been sent to your email!');
      closeForgotPasswordModal();
    } else {
      forgotPasswordError.value = data.message || 'Failed to send reset link.';
    }
  } catch (error) {
    forgotPasswordError.value = 'An error occurred. Please try again.';
  }
};
</script>

<style scoped>
@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.animate-pulse-scale {
  animation: pulse-scale 3s infinite ease-in-out;
}
</style>
