<template>
  <div
    class="flex justify-center items-center h-screen bg-gradient-to-b from-indigo-300 via-blue-400 to-[#0080D1]"
  >
    <div class="w-96 p-8 bg-white rounded-xl shadow-lg text-center">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Reset your Password</h2>

      <div v-if="step === 1">
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          @click="sendResetEmail"
          class="w-full bg-blue-500 text-white py-3 rounded-lg font-bold transition-transform transform hover:scale-105 hover:bg-blue-600"
        >
          Send Reset Email
        </button>
        <p v-if="message" class="text-green-500 text-sm mt-2">{{ message }}</p>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <div v-if="step === 2">
        <input
          v-model="newPassword"
          type="password"
          placeholder="New password"
          class="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm password"
          class="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          @click="changePassword"
          class="w-full bg-green-500 text-white py-3 rounded-lg font-bold transition-transform transform hover:scale-105 hover:bg-green-600"
        >
          Change Password
        </button>
        <p v-if="message" class="text-green-500 text-sm mt-2">{{ message }}</p>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@/composables/useFetch';

const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const errorMessage = ref('');
const step = ref(1);
const route = useRoute();

// Check if token is in URL
onMounted(() => {
  const token = route.query.token;
  if (token) {
    step.value = 2;
  }
});

const sendResetEmail = async () => {
  message.value = '';
  errorMessage.value = '';

  if (!email.value) {
    errorMessage.value = 'Please enter your email.';
    return;
  }

  try {
    const { res, data } = await useFetch('/auth/request-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    });

    if (res.ok) {
      message.value = 'Check your email for the password reset link!';
      email.value = '';
    } else {
      errorMessage.value = data.message || 'Failed to send reset email.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.';
  }
};

const changePassword = async () => {
  message.value = '';
  errorMessage.value = '';

  if (!newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields.';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  try {
    const token = route.query.token;
    const { res, data } = await useFetch('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        password: newPassword.value,
      }),
    });

    if (res.ok) {
      message.value = 'Password changed successfully! Please reopen Chipstok and log in.';
    } else {
      errorMessage.value = data.message || 'Failed to change password.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.';
  }
};
</script>
