<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-300 via-blue-400 to-[#0080D1] relative overflow-hidden">
    <div class="w-96 p-8 bg-white border border-gray-300 rounded-xl shadow-lg text-center relative z-10">
      <h1 class="text-3xl font-extrabold mb-6 text-gray-800">Chipstok</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input v-model="username" type="text" id="UWD" name="Username" autocomplete="username"
            placeholder="Phone number, username, or email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
        </div>
        <div>
          <input v-model="password" type="password" id="PWD" name="Password" autocomplete="current-password"
            placeholder="Password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
        </div>
        <button type="submit"
          class="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 hover:bg-blue-600">
          <div v-if="!loading">
            Log in
          </div>
          <div v-else class="flex justify-center items-center">
            <Loader2 class="animate-spin w-4 h-4" />
          </div>
        </button>
      </form>
      <div class="mt-4 text-sm text-gray-500">
        <a href="#" class="text-blue-500 hover:underline">Forgot password?</a>
      </div>
      <div class="mt-6 border-t pt-4 text-sm text-gray-700">
        Don't have an account? <a href="/signup" class="text-blue-500 font-bold">Sign up</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { useFetch } from '@/helpers/fetch';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref({ username: '', password: '' });
const router = useRouter();

const login = async () => {
  errors.value = { username: '', password: '' };

  if (!username.value) {
    errors.value.username = 'Username is required';
  }
  if (!password.value) {
    errors.value.password = 'Password is required';
  }
  if (username.value && password.value) {
    loading.value = true;

    try {
      const { res, data } = await useFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          identifier: username.value,
          password: password.value
        }),
        credentials: 'include'
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

const goToSignup = () => {
  router.push('/signup');
};
</script>
